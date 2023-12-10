var express = require('express');
var router = express.Router();
const getBalanceSheetController = require('../controllers/get-balance-sheet');

router.post('/', function(req, res, next) {
  const balanceSheet = getBalanceSheetController.getBalanceSheet(req);
  res.send(balanceSheet);
});

module.exports = router;
