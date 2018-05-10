var timeAgo = require('simple-timeago');
var __ = require('underscore');
var exports = module.exports = {};

exports.renderHTML = function(data, cb) {
	var summary = [];
	var detail = [];

	for(i=0; i< data.length; i++){
		var purchasingPower="";
		var cash="";
		var travel="";
		var giftcard="";
		var charity="";
		var rewardsCurrency = data[i].rewardsCurrency;
		var ifcash = "";
		if(rewardsCurrency == "Cash") ifcash="$";

		var acct='<li class="bricklet COF" id="'+i+'" onclick="toggle_display('+i+')"><h3><div class="Description">' + data[i].accountDisplayName.slice(0,-5) + '</div></h3><h4><div class="acct_num">XXXX-XXXX-XXXX-'+data[i].accountDisplayName.slice(-4)+'</div><div class="rewardsBalance">Balance: ' + ifcash + nwc(data[i].rewardsBalance) + ' ' + rewardsCurrency + '</div></h4><h5><span class="name">' + data[i].primaryAccountHolder.firstName + ' ' + data[i].primaryAccountHolder.lastName + '</span><span class="card_type">' + data[i].creditCardAccount.network + '</h5></li>';

		for (x=0; x< data[i].redemptionOpportunities.length; x++){
			purchasingPower="Purchasing Power";
			var opp = data[i].redemptionOpportunities[x];
			if(opp.category == 'Cash'){
				if (cash === "" && x === 0){
						cash += '<div class="row opp_title" > <div id="col-5"> '+ opp.categoryDescription + ' </div> <div id="col-6"> Value </div> <div id="col-7"> ' + rewardsCurrency + ' or Rate </div> </div>';
					} else if (cash === ""){
						cash += '<div class="row opp_title" > <div id="col-5"> '+ opp.categoryDescription + ' </div> <div id="col-6">  </div> <div id="col-7"> </div> </div>';
					}
				cash += '<div class="row"> <div id="col-8"> <li>'+ opp.subcategoryDescription +'</li> </div> <div id="col-9"> <li>'+ opp.cashDisplayValue +'</li> </div> <div id="col-10"> <li>1 / $' + opp.redemptionRate +'</li> </div> </div>';
			}

			else if(opp.category == 'Travel'){
				if (travel === "" && x === 0){
						travel += '<div class="row opp_title" > <div id="col-5"> '+ opp.categoryDescription + ' </div> <div id="col-6"> Value </div> <div id="col-7"> ' + rewardsCurrency + ' or Rate </div> </div>';
					} else if (travel === ""){
						travel += '<div class="row opp_title" > <div id="col-5"> '+ opp.categoryDescription + ' </div> <div id="col-6">  </div> <div id="col-7"> </div> </div>';
					}
				if(opp.hasOwnProperty('tierMinCashValue')){
					if(opp.tierMinCashValue === 0.01){
						travel += '<div class="row"> <div id="col-8"> <li>'+ opp.subcategoryDescription +'</li> </div> <div id="col-9"> <li>Up to $' + __.min([opp.cashValue,opp.tierMaxCashValue]) +'</li> </div> <div id="col-10"> <li>' + nwc(opp.redemptionAmount) +' ' + rewardsCurrency + '</li> </div> <div id="col-11"> <li></li> </div> </div>';
					} else{

						travel += '<div class="row"> <div id="col-8"> <li></li> </div> <div id="col-9"> <li>$'+ opp.tierMinCashValue + ' to $' + __.min([opp.cashValue,opp.tierMaxCashValue]) +'</li> </div> <div id="col-10"> <li>' + nwc(opp.redemptionAmount) +' ' + rewardsCurrency + '</li> </div> <div id="col-11"> <li></li> </div> </div>';
					}
				} else{
					travel += '<div class="row"> <div id="col-8"> <li>'+ opp.subcategoryDescription +'</li> </div> <div id="col-9"> <li>'+ opp.cashDisplayValue +'</li> </div> <div id="col-10"> <li>1 / $' + opp.redemptionRate +'</li> </div> <div id="col-11"> <li></li> </div> </div>';
				}
			}

			else if(opp.category == 'GiftCard'){
				if (giftcard === ""){
					giftcard += '<div class="row opp_title" > <div id="col-5"> '+ opp.categoryDescription + ' </div> <div id="col-6">  </div> <div id="col-7"> </div> </div>';
				}
				if(opp.hasOwnProperty('tierMinCashValue')){
					if(opp.tierMinCashValue === 0.01){
						giftcard += '<div class="row"> <div id="col-8"> <li>'+ opp.subcategoryDescription +'</li> </div> <div id="col-9"> <li>Up to $' + __.min([opp.cashValue,opp.tierMaxCashValue]) +'</li> </div> <div id="col-10"> <li>1 / $' + opp.redemptionRate +'</li> </div> <div id="col-11"> <li></li> </div> </div>';
					} else {
						giftcard += '<div class="row"> <div id="col-8"> <li></li> </div> <div id="col-9"> <li>$'+ opp.tierMinCashValue + ' to $' + __.min([opp.cashValue,opp.tierMaxCashValue]) +'</li> </div> <div id="col-10"> <li>1 / $' + opp.redemptionRate +'</li> </div> <div id="col-11"> <li></li> </div> </div>';
					}
				} else{
					giftcard += '<div class="row"> <div id="col-8"> <li>'+ opp.subcategoryDescription +'</li> </div> <div id="col-9"> <li>'+ opp.cashDisplayValue +'</li> </div> <div id="col-10"> <li>1 / $' + opp.redemptionRate +'</li> </div> <div id="col-11"> <li></li> </div> </div>';
				}
			}
			else if(opp.category=='Charity'){
			if (charity === ""){
					charity += '<div class="row opp_title" > <div id="col-5"> '+ opp.categoryDescription + ' </div> <div id="col-6">  </div> <div id="col-7">  </div> </div>';
				}
				charity += '<div class="row"> <div id="col-8"> <li>'+ opp.subcategoryDescription +'</li> </div> <div id="col-9"> <li>'+ opp.cashDisplayValue +'</li> </div> <div id="col-10"> <li>1 / $' + opp.redemptionRate +'</li> </div> <div id="col-11"> <li></li> </div> </div>';
			}
		}
		var date = new Date(data[i].balanceTimestamp);
		var lastChecked = timeAgo(date);

		var acct_detail = '<li class="bricklet2 details" id="'+i+'" onclick="toggle_display('+i+')"><h3> <div id="Description"> ' + data[i].accountDisplayName.slice(0,-5) + ' </div> </h3> <h4> <div id="acct_num"> XXXX-XXXX-XXXX-'+data[i].accountDisplayName.slice(-4)+' </div> </h4> <h5> <div class="row"> <div id="col-1"> <ul> <li>Account Holder:</li> <li>Balance:</li> <li>Last Checked:</li> </ul> </div> <div id="col-2"> <ul> <li>'+ data[i].primaryAccountHolder.firstName + ' ' + data[i].primaryAccountHolder.lastName +'</li> <li>'+ ifcash + nwc(data[i].rewardsBalance) + ' ' + data[i].rewardsCurrency +'</li> <li>' + lastChecked + '</li> </ul> </div> <div id="col-3"> <ul> <li>Redemption Allowed:</li> <li>Transfer In Allowed:</li> <li>Transfer Out Allowed:</li> </ul> </div> <div id="col-4"> <ul> <li ' + img(data[i].canRedeem) +'</li> <li ' + img(data[i].canTransferIn) + '</li> <li '+ img(data [i].canTransferOut) + '</li> </ul> </div> </div> <div id="purchasing_power"> <h3>'+ purchasingPower + '</h3> </div> '+  travel + cash + giftcard + charity +' </h5></li>';
		summary.push(acct);
		detail.push(acct_detail);
	}
	return cb(null,summary, detail, data[0].primaryAccountHolder.firstName);

	function nwc(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function img(bool){
		if(bool){
			return 'class=check> &#10003';
		} else {
			return 'class=x> &#10005';
		}
	}
};
