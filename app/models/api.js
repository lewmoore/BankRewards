var uuid = require('uuid');
var config = require('../../config/config');
var request = require('request');

var oauth2 = require('simple-oauth2')({
   clientID: config.CLIENT_ID,
   clientSecret: config.CLIENT_SECRET,
   site: config.BASE_URI,
   tokenPath: '/oauth2/token',
   authorizationPath: '/oauth2/authorize',
   headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'User-Agent':'curl/7.43.0'
           }
});

var authorization_uri = oauth2.authCode.authorizeURL({
   redirect_uri: config.REDIRECT_URI,
   scope: 'read_rewards_account_info'
});

var exports = module.exports = {};

// this is called by /auth route and the auth_uri comes from call to simple-oauth2 library. The call is above.
// The end result of this call is rendering of the log in screen.
// The user then gains control and logs in and selects rewards to athorize. This then fires over to route /authredirect
exports.getAuthURL = function() {
 return authorization_uri;
};

// this is passed the auth code from the route and exchanges it for a bearer token. this then completes the OAuth process
exports.processCode = function(code, cb) {
   oauth2.authCode.getToken({ code: code, redirect_uri: config.REDIRECT_URI}, function(error, result) {
       if (error) {
           return cb('Invalid authorization code. Please try logging in again.');
       }
       token = oauth2.accessToken.create(result);
       return cb(null, token.token.access_token);
   });
};

exports.getAcctSummary = function(accessToken, cb) {

   var acct_req = request
   .get(config.BASE_URI + '/rewards/accounts', {'auth': {'bearer': accessToken}, 'headers':{'User-Agent':'curl/7.43.0'}})
   .on('error', function(err) {
       return cb(err);
   })
   .on('response', onSummaryResponse);

   function onSummaryResponse(res) {
       var dataBody = '';
       res.setEncoding('utf8');
       res.on('data', function (chunk) {
           console.log('****Response from rewards summary: ' + chunk + '\n');
           dataBody += chunk;
       });

       res.on('end', function () {
           if (res.statusCode === 403) {
               return cb('Access denied due to customer or account standing. Please login to online account for more information.');
           }
           if (res.statusCode !== 200) {
               return cb('Summary API experienced a problem. Please try logging in again.');
           }
           return cb(null, JSON.parse(dataBody));
       });
   }
};

exports.getAcctDetail = function( accessToken, ref_id, cb) {

   var acct_req = request.get(config.BASE_URI + '/rewards/accounts/' + ref_id, {'auth': {'bearer': accessToken}, 'headers':{'User-Agent':'curl/7.43.0'}})
   .on('error', function(err) {
       return cb(err);
   })
   .on('response', onDetailResponse);

   function onDetailResponse(res) {
       var dataBody = '';
       res.setEncoding('utf8');
       res.on('data', function (chunk) {
           console.log('****Response from rewards detail: ' + chunk + '\n');
           dataBody += chunk;
       });
       res.on('end', function () {
           if (res.statusCode !== 200) {
               return cb('Detail API experienced a problem. Please try logging in again.');
           }
           return cb(null, JSON.parse(dataBody));
       });
   }
};
