const express = require('express');
const router = express.Router();

const groupControllers = require("../controllers/groupControllers");


const requireAuth = require("../middleware/requireAuth");

router.post('/create-group',requireAuth ,groupControllers.createGroup);
router.post('/add-member/:groupId',requireAuth ,groupControllers.addMember);
router.post('/join-group/:groupId',requireAuth ,groupControllers.joinGroup);
router.get('/',requireAuth ,groupControllers.fetchGroupsName);
router.get('/:userId',requireAuth ,groupControllers.fetchMyGroups);
router.get('/group-details/:groupId',requireAuth ,groupControllers.fetchGroupDetails);
router.delete('/delete-group/:group_name',requireAuth ,groupControllers.removeGroup);
router.delete('/remove-group-member/:memberEmail/:groupName',requireAuth ,groupControllers.removeMemberFromGroup);

module.exports = router;