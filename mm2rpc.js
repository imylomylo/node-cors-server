const axios = require('axios');

up = "zzgpfg17u6lgCQ5hqFEBPDhfrTDVRtvp";

// example:
// getEnabledCoins(up).then(res => {
// 	console.log(res)
// })

// connectCoin(up, "MORTY")

module.exports = {

	getEnabledCoins: function (userpass = up) {
		// function getEnabledCoins(userpass = up) {
		console.log("GetEnabledCoins")
		const requestData = {
			jsonrpc: "2.0",
			method: "get_enabled_coins",
			userpass: userpass,
			id: Date.now(),
			timeout: 3000
		};
		const mmres = sendRequest(requestData)
		console.info(mmres)
		return mmres
	},

	connectCoin: function (userpass = up, coin) {
		// function connectCoin(userpass, coin) {
		const servers = [{
				url: "electrum1.cipig.net:10018"
			},
			{
				url: "electrum2.cipig.net:10018"
			},
			{
				url: "electrum3.cipig.net:10018"
			}
		]
		const requestData = {
			jsonrpc: "2.0",
			method: "electrum",
			coin: coin,
			servers: servers,
			userpass: userpass,
			id: Date.now(),
			timeout: 3000
		};
		return sendRequest(requestData)
	}
};

function sendRequest(requestData) {
	return axios.post("http://127.0.0.1:7783", requestData)
		.then(res => {
			return res.data
		})
		.catch(err => console.error(err))
}