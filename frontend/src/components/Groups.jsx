// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import groupStore from './groupStore';
// function Groups() {
//   const [groupList, setGroupList] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   useEffect(() => {
//     fetchGroups();
//     console.log(groupList);
//   }, []);

//   const fetchGroups = async() => {
//     try{
//         const res = await axios.get('/groups/');
//     }
//     catch(err) {
//         console.log('Error fetching groups:', err);
//         }
//   }
//   const handleGroupClick = async(groupId) =>{
//     try {
//         const res = await axios.get(`/groups/group-details/${groupId}`); 

//         setSelectedGroup(res.data);
//       } catch (err) {
//         console.log('Error fetching group details:', err);
//       }
//   }
//   return (
//     <div>
//       <h2>Group Names:</h2>
//       <ul>
//         {groupList && groupList.map(group => (

//           <li key={group._id} onClick={ () => handleGroupClick(group.group_name)}>
//             {group.group_name}
//             </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Groups;
