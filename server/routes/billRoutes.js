const express = require('express');
const router = express.Router();

const billsControllers = require("../controllers/billsControllers");

const requireAuth = require("../middleware/requireAuth");

router.get("/getbills/:groupId", requireAuth,billsControllers.fetchBills);
router.get("/splitbills/:groupId", requireAuth,billsControllers.splitBills);
router.get("/bill/:id",requireAuth, billsControllers.fetchBill);
router.post("/addBill/:groupId", requireAuth,billsControllers.createBill);
router.put("/updateBill/:billId/:groupId", requireAuth,billsControllers.updateBill);
router.delete("/deleteBill/:billId/:groupId", requireAuth,billsControllers.deleteBill);
router.delete("/deleteBills/:groupId",requireAuth, billsControllers.deleteBills);

module.exports = router;