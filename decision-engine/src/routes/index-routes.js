var express = require('express');
var router = express.Router();
const decisionEngineController = require('../controllers/decisionController');

router.post('/', function(req, res, next) {
  const decision = decisionEngineController.getDecision(req);
  res.send(decision);
});

module.exports = router;
