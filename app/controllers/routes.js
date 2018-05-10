var express = require('express'),
 router = express.Router(),
 api = require('../models/api');
 util = require('../models/util');

module.exports = function (app) {
 app.use('/', router);
};

router.get('/', function(req, res) {
 res.render('index');
});

// This route is called when user clicks button on index.js and this points to api.js line 24
router.get('/auth', function (req, res) {
   res.redirect(api.getAuthURL());
});

// This is called once the user is logged in and authorizes some reward accounts
router.get('/authredirect',function(req,res) {
   if (!Object.keys(req.query).length) {
       return res.status(401).render('error', {error: 'Did not receive authorization code.'});
   }
   var code = req.query.code;
   api.processCode(code, function(err, token) {
       if(err){
           return res.status(403).render('error', {error: 'Invalid authorization code.'});
       }
       req.session.token=token;
       res.render('loading');
   });
});

router.get('/accountSummary',function(req,res) {
   var acctInfo = [];
   var numAccts;
   if(!req.session.token) {
       return res.status(403).render('error', {error: 'You must grant access to see this page.'});
   }
   api.getAcctSummary(req.session.token, function(err, accts) {
       if(err) {
           return res.status(500).render('error', {error: err});
       }
       numAccts = accts.rewardsAccounts.length;
       for(var acctIndex=0; acctIndex < numAccts; acctIndex++ ) {
           var refId = encodeURIComponent(accts.rewardsAccounts[acctIndex].rewardsAccountReferenceId);
           api.getAcctDetail(req.session.token, refId, onDetailResponse);
       }

       function onDetailResponse(err, acct_detail) {
           if(err) {
               return res.status(500).render('error', {error: err});
           }
           acctInfo.push(acct_detail);
           if(acctInfo.length === numAccts) {
               util.renderHTML(acctInfo, function(err, summaryDisplay, detailDispaly, name) {
                   return res.render('account-summary', { summary: summaryDisplay, detail: detailDispaly, name: name});
               });
           }
       }
   });
});

router.get('/logout',function (req, res) {
   req.session.destroy();
   res.status(200).send('logged out');
});
