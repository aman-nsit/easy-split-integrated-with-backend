import React, {useState, useEffect} from 'react'
import billCalculator from '../service/service';
import axios from "axios";

export default function Home() {

    const memberList =[]
    const [no_need_to_split , set_no_split] =useState(false);
    const [res,getRes] = useState();

    const [members, setMembers] = useState([]);
    const [createForm, setCreateForm] = useState({
        payer: "",
        amount: "",
    });

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try{
            const res = await axios.get("/bills");
            // Set to state
            setMembers(res.data.bills);
        }catch(err){
            console.log(err);   
          }
    };

    const createBill = async (e) => {
        e.preventDefault();
        // check present or not in members if yes just do update
        const member =  members.find((member) => member.payer === createForm.payer);
        if(member){
            const payer = member.payer;
            const amount = member.amount + createForm.amount;
            member.amount = amount;
            const res = await axios.post(`/updateBill/${member._id}`, {payer:payer,amount:amount});
            setMembers([...members, res.data.bill]);
        }
        else{ // not present create and add in member
            const res = await axios.post("/addBill", createForm);
            setMembers([...members, res.data.bill]);
        }
        setCreateForm({
          payer: "",
          amount: "",
        });
    };

    const deleteMember = async (_id) => {
        // Delete the note
        const res = await axios.delete(`/deleteBill/${_id}`);
    
        // Update state
        const newMembers = [...members].filter((member) => {
          return member._id !== _id;
        });
    
        setMembers(newMembers);
    };

    const handleSplitBills  = () =>{

    }

    const handleReset  = () =>{

    }

  return (
    <div className='container'>
        <h2 className='heading'>Add Expense Here :</h2>
        <div className='form-group'>
            <form onSubmit={createBill}>
                <input placeholder='Member Name' type="text" required/>
                <input placeholder='Amount' type='number' required/>
                <button>Add Expense</button>
            </form>
        </div>
        {(members && !res) && <div className="member-list">
          <h2>Member List:</h2>
          <ul className='member-item'>
          {members && <b><li><div>Payer:</div>Amount:</li></b>}
            {members.map((member, index) => (
              <li key={index}>
                 <div className='payer' >{member.payer}</div>
                 <div className='amount' >Rs {member.amount}</div> 
              </li>
            ))}
          </ul>
        </div>  
      }

        <div>    
          <button onClick={handleSplitBills}>Split Bill</button>
          <button onClick={handleReset}>Reset</button>
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

    </div>
  )
}
