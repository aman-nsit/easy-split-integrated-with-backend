import React, {useState, useEffect} from 'react'
import billCalculator from '../service/service';
import axios from "axios";
import delImg from "../delete.png" ;
import loadingImg from "../loading.png" ;
import paymentImg from "../payment.png" ;
import {Link} from "react-router-dom";
export default function Home() {

    const memberList =[]
    const [userName,setUserName] = useState("");
    const [no_need_to_split , set_no_split] =useState(false);
    const [res,getRes] = useState();
    const [showExpenses,setShowExpenses] = useState(true);
    const [members, setMembers] = useState([]);
    const [createForm, setCreateForm] = useState({
        payer: "",
        amount: "",
    });
    const [isLoading,setIsLoading] = useState(false);
    const updateCreateFormField = (e) => {
        const { name, value } = e.target;
    
        setCreateForm({
          ...createForm,
          [name]: value,
        });
      };

    useEffect(() => {
        fetchBills();
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async() =>{
        const res = await axios.get('/userDetails'); 
        setUserName(res.data.user_name);
    }

    const fetchBills = async () => {
        try{
            let token=localStorage.getItem("accesstoken")
            axios.defaults.headers.common['token'] = token ;
            const res = await axios.get("/bills");
            // Set to state
            setMembers(res.data.bills);
        }catch(err){
            console.log(err);   
          }
    };

    const createBill = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        // check present or not in members if yes just do update
        const member =  members.find((member) => member.payer === createForm.payer.toLowerCase());
        if(member){
            console.log(member);
            const payer = member.payer;
            const amount = parseInt(member.amount) + parseInt(createForm.amount);
            member.amount = amount;
            const res = await axios.put(`/updateBill/${member._id}`, {payer:payer,amount:amount});
        }
        else{ // not present create and add in member
            const payer = createForm.payer.toLowerCase();
            const amount = createForm.amount;
            console.log(payer);
            const res = await axios.post("/addBill", {payer,amount});
        }
        setCreateForm({
          payer: "",
          amount: "",
        });
        fetchBills();
        setIsLoading(false);
    };

    const deleteMember = async (e) => {
        setIsLoading(true);
        // Delete the note
        const _id = e;
        const res = await axios.delete(`/deleteBill/${_id}`);
        // Update state
        fetchBills();
        setIsLoading(false);
    };

    const handleSplitBills  = () =>{
        set_no_split(false);
        if(members.length){ 
            let expense = 0;
            for(let member of members)expense+=member.amount;
            const billresult=billCalculator(members,expense);
            if(billresult.length === 0){
            set_no_split(true);
            }
            else {
            getRes(billresult);
            }
        }
        setShowExpenses(false);
    }

    const handleReset  =async () =>{
        setIsLoading(true);
        const res = await axios.delete(`/deleteBills/`);
        // Update state
        fetchBills();
        setIsLoading(false);
    }
    const handleShowExpenses = async () => {
        getRes();
        setShowExpenses(!showExpenses);
        set_no_split(false)
    }
      return (
    <div>
        <button className='log-out' ><Link className="link" to="logout">Logout</Link></button>
        <div className='container'>
            <h2 className='heading'>{userName} , Add Expense Here :</h2>
            <div className='form-group'>
                <form onSubmit={createBill}>
                    <input onChange={updateCreateFormField} value={createForm.payer} name="payer" placeholder='Member Name' type="text" required/>
                    <input onChange={updateCreateFormField} value={createForm.amount} name="amount" placeholder='Amount' type='number' required/>
                    <button type='submit'>Add Expense</button>
                </form>
            </div>
            {(members.length>0 && !res) && <div className="member-list">
            <h2>Member List:</h2>
            <ul className='member-item'>
            {members && <b><li><div>Payer:</div>Amount:</li></b>}
                {members.map((member, index) => (
                <li key={index}>
                    <div className='payer' >{member.payer}</div>
                    <div className='set-del'>
                    <div className='amount' >Rs {member.amount}</div>
                    <button className='del' onClick={()=>deleteMember(member._id)}><img className="del-img" src={delImg} /> </button>
                    </div>
                </li>
                ))}
            </ul>
            </div>  
        }
            <div>    
                {showExpenses && <button onClick={handleSplitBills}>Split Bill</button>}
                {!showExpenses && <button onClick={handleShowExpenses}>Show Expenses</button>}
                <button onClick={handleReset}>Reset</button> 
                {isLoading && <img className='processing' src={loadingImg} alt='Loading' />}
            {
                no_need_to_split && <div className='no_split'>
                    Don't Worry About Splitting , It's already done.
                </div>
            }
            {res && <div className="member-list">
            <h2>Amount:</h2>
            <ul className='member-item'>
                {res && <b><li>Payer<div>Amount</div>Reciever</li></b>}
                {res.map((member) => (
                <li  key={member}>
                    <div className='payer'>{member[0]}</div> 
                    <div className='amount'>  Rs {member[2].toFixed(2)} 
                    </div> <div className='reciever'>{member[1]}</div>
                </li>
                ))}
            </ul>
            </div>}
            </div>
            
            { !res && members.length==0 && <img className='payment-img' src={paymentImg}/>}
        </div>

    </div>
  )
}
