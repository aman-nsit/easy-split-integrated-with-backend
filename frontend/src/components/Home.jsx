import React, {useState, useEffect} from 'react'
import billCalculator from '../service/service';
import axios from "axios";
import delImg from "../delete.png" ;
import loadingImg from "../loading.png" ;
import paymentImg from "../payment.png" ;
import {Link} from "react-router-dom";
import Groups from './Groups';
export default function Home() {

    const memberList =[]
    const [userDetails,setUserDetails] = useState("");
    const [no_need_to_split , set_no_split] =useState(false);
    const [res,getRes] = useState();
    const [showExpenses,setShowExpenses] = useState(true);
    const [members, setMembers] = useState([]);
    const [createForm, setCreateForm] = useState({
        payer: "",
        amount: "",
    });

    const [groupList, setGroupList] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [usersList,setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [expenseInput, setExpenseInput] = useState('');
    const [bills, setBills] = useState([]);
    const [myGroups , setMyGroups] = useState([]);
    const [allUsers,setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [createdGroupName,setCreatedGroupName]=useState("");

    const [isLoading,setIsLoading] = useState(false);
    const updateCreateFormField = (e) => {
        const { name, value } = e.target;
    
        setCreateForm({
          ...createForm,
          [name]: value,
        });
      };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async() =>{
        let token=localStorage.getItem("accesstoken")
        axios.defaults.headers.common['token'] = token ;
        const res = await axios.get('/users/userDetails');
        setUserDetails(res.data);
        const res2 = await axios.get('/users/allUsers');
        const total_users=res2.data;
        for(let i=0;i<total_users.length;i++){
            if(res.data._id===total_users[i]._id){
                // console.log(res.data._id);
                total_users.splice(i,1);
            }
        }
        
        fetchGroups(res.data);
        setAllUsers(total_users);
    }

    const createBill = async (e) => {
        try{
            setIsLoading(true);
        e.preventDefault();
        // console.log(createForm);
        let userId =  createForm.payer;
        let amount = createForm.amount;
        amount = parseInt(createForm.amount);
        let OldBill;
        for(let bill of selectedGroup.bills){
            if(bill.payer_id===userId){
                OldBill=bill._id;
                break;
            }
        }
        let res ;
        if(!OldBill){
            // console.log(selectedGroup._id);
             res = await axios.post(`/bills/addBill/${selectedGroup._id}`, {userId,amount});
        }
        else{ 
            // console.log(OldBill);
            // console.log(selectedGroup._id);
             res = await axios.put(`/bills/updateBill/${OldBill}/${selectedGroup._id}`, {userId,amount});
        }

        setCreateForm({
          payer: "",
          amount: "",
        });
        handleGroupClick(selectedGroup._id);
        // console.log(res);
        setIsLoading(false);
        }
        catch(err){
            console.log(err);
        }
    };

    const deleteMember = async (e) => {
        setIsLoading(true);
        // Delete the note
        const billId = e;
        const groupId =selectedGroup._id;
        const res = await axios.delete(`/bills/deleteBill/${billId}/${groupId}`);
        handleGroupClick(selectedGroup._id);
        setIsLoading(false);
    };

    const handleSplitBills  = async () =>{
        set_no_split(false);
        // if(members.length){ 
        //     let expense = 0;
        //     for(let member of members)expense+=member.amount;
        //     const billresult=billCalculator(members,expense);
        //     if(billresult.length === 0){
        //     set_no_split(true);
        //     }
        //     else {
        //     getRes(billresult);
        //     }
        // }
        setIsLoading(true);
        console.log(selectedGroup);
        const groupId=selectedGroup._id;
        const res = await axios.get(`./bills/splitBills/${groupId}`);
        // console.log(res.data);
        if(!res.data.length)set_no_split(true);
        else getRes(res.data);
        setShowExpenses(false);
        setIsLoading(false);
    }

    const handleReset  =async () =>{
        setIsLoading(true);
        let groupId=selectedGroup._id;
        if(groupId){
            const res = await axios.delete(`/bills/deleteBills/${groupId}`);
            // Update state
            handleGroupClick(selectedGroup._id);
        }
        
        setIsLoading(false);
    }
    const handleShowExpenses = async () => {
        getRes();
        setShowExpenses(!showExpenses);
        set_no_split(false)
    }


    
      const fetchGroups = async(user) => {
        try{
            const res = await axios.get(`/groups/${user._id}`);
            let groupList=res.data.groups;
            setGroupList(groupList);
        }
        catch(err) {
            console.log('Error fetching groups:', err);
            }
      }
      const handleGroupClick = async(groupId) =>{
        try {
            setIsLoading(true);
            const res = await axios.get(`/groups/group-details/${groupId}`); 
            setSelectedGroup(res.data);
            
            // console.log(res.data.users);
            setUsersList(res.data.users);
            // console.log(usersList);
            setMembers(res.data.bills);
            setIsLoading(false);
            set_no_split(false);
            setShowExpenses(true);
            getRes();
          } catch (err) {
            setIsLoading(false);
            console.log('Error fetching group details:', err);
          }
      }
      const handleDeleteGroup = async(groupId) =>{
        try {
            setIsLoading(true);
            const res = await axios.delete(`/groups/delete-group/${groupId}`); 
            setSelectedGroup([]);
            
            console.log(res.data);
            // console.log(usersList);
            fetchGroups(userDetails);
            setIsLoading(false);
            set_no_split(false);
            setShowExpenses(true);
            getRes();
          } catch (err) {
            setIsLoading(false);
            console.log('Error fetching group details:', err);
          }
        }
   
      const handleCheckboxChange = (userId) => {
        const isChecked = selectedUsers.includes(userId);
        if (isChecked) {
          setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
        } else {
          setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
        }
      };
    
      const handleCreateGroup = async(e) => {
        try{
            e.preventDefault();
            setIsLoading(true);
            if(selectedUsers.length!=0){
                const create_group = await axios.post('/groups/create-group',{group_name:createdGroupName,users:selectedUsers}); 
                setCreatedGroupName("");
                setSelectedUsers([]);
                fetchGroups(userDetails);
            }
            setIsLoading(false);
        }
        catch(err){
            setIsLoading(false);
            console.log(err);

        }
      };

      return (
<div>
  <button className='log-out'>
    <Link className="link" to="users/logout">Logout</Link>
  </button>

  <div className='container-group' >
    <h2 className='heading-group'>Your Groups:</h2>
    <div className='member-list-group'>
      <ul className='member-item' >
        {groupList && groupList.filter(group => group.group_admin === userDetails._id).map(group => (
          
          <li className='member-name' key={group._id} >
            <div className='group-name' onClick={() => handleGroupClick(group._id)}>{group.group_name}</div>
            <button className='del' onClick={() => handleDeleteGroup(group._id)}><img className="del-img" src={delImg} /></button>
          </li>
        ))}
      </ul>
    </div>
    <div>
    <h2 className='heading-group'>Joined Groups:</h2>
    <div className='member-list-group' >
      <ul className='member-item' >
        {groupList && groupList.filter(group => group.group_admin !== userDetails._id).map(group => (
          <li className='member-name' key={group._id} >
            <div className='group-name' onClick={() => handleGroupClick(group._id)}>{group.group_name}</div>
          </li>
        ))}
      </ul>
    </div>
    </div>
    {/* <button style={{position:'fixed',bottom:'130px'}}>
      <Link className="link" to="/normalSplit">Normal Split</Link>
    </button> */}
  </div>

  <div className='container-users'>
    {allUsers ? (
      <div className='form-group'>
        <h2 className='heading'>Select Users</h2>
        <form onSubmit={handleCreateGroup}>
          
          <input placeholder='Group Name' type='text' value={createdGroupName} onChange={(e) => setCreatedGroupName(e.target.value)} required />
          <div className='member-list'>
          <ul className='member-item'>
            {allUsers.map((user) => (
              <li>
                <div style={{display:'flex',fontWeight:'550'}}>
              <input
                type="checkbox"
                id={user._id}
                value={user._id}
                onChange={() => handleCheckboxChange(user._id)}
                checked={selectedUsers.includes(user._id)}
              />
              <div key={user._id} >{user.user_name}</div>
              </div>
              </li>
          ))}
          </ul>
          </div>
          <button className='user-button' style={{position:'fixed'}}>Create Group</button>
        </form>
      </div>
    ) : (
      <p>Loading users...</p>
    )}
  </div>

  <div className='container'>
    <h2 className='heading'><label style={{textTransform:'uppercase'}}>{userDetails.user_name}</label>, Add Expense Here:</h2>
    {selectedGroup &&
      <div > 
         <div className='heading'> Group Name :<label style={{textTransform:'uppercase'}}> {selectedGroup.group_name}</label></div>
         </div>
      }
    <div>
      <form onSubmit={createBill}>
        <select onChange={updateCreateFormField} value={createForm.payer} name="payer" required>
          <option value="">Select User</option>
          {usersList.length && usersList.map((user) => (
            <option key={user._id} value={user._id}>
              {user.user_name}
            </option>
          ))}
        </select>

        <input onChange={updateCreateFormField} value={createForm.amount} name="amount" placeholder='Amount' type='number' required />
        <button type='submit'>Add Expense</button>
      </form>
    </div>
    {(members.length > 0 && !res) && (
      <div className="member-list">
        <h2>Member List:</h2>
        <ul className='member-item'>
          {members && <b><li><div>Payer:</div>Amount:</li></b>}
          {members.map((member, index) => (
            <li key={index}>
              <div className='payer'>{member.payer}</div>
              <div className='set-del'>
                <div className='amount'>Rs {member.amount}</div>
                <button className='del' onClick={() => deleteMember(member._id)}><img className="del-img" src={delImg} /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div>
      {showExpenses && <button onClick={handleSplitBills}>Split Bill</button>}
      {!showExpenses && <button onClick={handleShowExpenses}>Show Expenses</button>}
      <button onClick={handleReset}>Reset</button>
      {isLoading && <img className='processing' src={loadingImg} alt='Loading' />}
      {no_need_to_split && (
        <div className='no_split'>
          Don't Worry About Splitting, It's already done.
        </div>
      )}
      {res && (
        <div className="member-list">
          <h2>Amount:</h2>
          <ul className='member-item'>
            {res && <b><li>Payer<div>Amount</div>Reciever</li></b>}
            {res.map((member) => (
              <li key={member}>
                <div className='payer'>{member[0]}</div>
                <div className='amount'> Rs {member[2].toFixed(2)}</div>
                <div className='reciever'>{member[1]}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {!res && members.length == 0 && <img className='payment-img' src={paymentImg} />}
  </div>
</div>

  )
}
