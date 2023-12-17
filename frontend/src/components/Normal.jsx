import React, { useState } from 'react'
import billCalculator from '../service/service';
import { useNavigate } from 'react-router-dom';

const members = new Map();
let expense=0;
function Normal() {
    const navigate = useNavigate();

  const [name , setName] = useState('');
  const [amount , setAmount] = useState('');
  const [memberList , setMemberList] = useState(null);
  const [res,getRes] = useState();
  const [no_need_to_split , set_no_split] =useState(false);
  const handleAddBill = (e) =>{
    e.preventDefault();
    var member = e.target[0].value.toLowerCase();
    const amount =parseFloat( e.target[1].value );
    // if valid name for member
    if(member){
    //if already has this member upgrade his expense
    if(members.has(member)){
      let temp=members.get(member);
      members.set(member,temp+amount);
    }
    else { 
      members.set(member,amount); // add new member
    }
    // total expense for the whole team
    expense+=amount;  
    
    setName('');
    setAmount('');
    getRes();
    set_no_split(false);
    // list of updated members 
    const newMemberList = Array.from(members).map(([memberName, amount]) => ({ name: memberName, amount }));
    setMemberList(newMemberList);
  }
  }
  const handleSplitBills = (e) => {
      set_no_split(false);
      if(members){ 
        const billresult=billCalculator(members,expense);
        if(billresult.length === 0){
          set_no_split(true);
        }
        else {
          getRes(billresult);
        }
      }
  }
  const handleReset =(e) =>{
    expense=0;
    getRes();
    setMemberList(null);
    set_no_split(false);
    members.clear();
  }
  return (
    <div className='container'>
      <div className="form-group">
          <form action="" onSubmit={handleAddBill}>
            <h3 className='heading'>Add Expense Here:</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value) } placeholder='Member Name' required/>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Amount Given' required/>
            <button>Add Member</button>
          </form>
      </div>
      {(memberList && !res) && <div className="member-list">
          <h2>Member List:</h2>
          <ul className='member-item'>
          {memberList && <b><li><div>Payer:</div>Amount:</li></b>}
            {memberList.map((member, index) => (
              <li key={index}>
                 <div className='payer' >{member.name}</div>
                 <div className='amount' >Rs {member.amount.toFixed(2)}</div> 
              </li>
            ))}
          </ul>
        </div>  
      }
        <div>    
          <button onClick={handleSplitBills}>Split Bill</button>
          <button onClick={handleReset}>Reset</button>
          <button onClick={() => navigate('/')}>Split in Group</button>
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
export default Normal

