'use strict';

//const fs = require('fs');
import fs from 'fs'
import axios from 'axios'

//let rawdata = fs.readFileSync('coins');
//let coins = JSON.parse(rawdata);
//console.log(coins);

let res = ''
let electrum = ''
fs.readFile('coins/coins', (err, data) => {
    if (err) throw err;
    let coins = JSON.parse(data);
    
// works
//    console.log(coins);

// works
//let res = coins.find( x => x.coin === 'BAT')
//console.log(res)
	
// works
//let res = coins.filter( x => x.mm2 === 1)
//console.log(res)

// works erc20
//res = coins.find( x => x.coin === 'BUSD')
//enable_etherc20(res.coin, res.etomic)

res = coins.find( x => x.coin === 'RFOX')
electrum = {}
fs.readFile('coins/electrums/'+res.coin, (err, data) => {
    if (err) throw err
    electrum = JSON.parse(data)
    console.log(res)
    console.log(electrum)
    enable_electrum(res.coin, electrum)
})

});

const up = 'testing'

function enable_electrum(coin, servers, userpass = up) {
  console.log("enable electrum: " )
  const requestData = {
    jsonrpc: "2.0",
    method: "electrum",
    coin: coin,
    servers: servers,
    userpass: userpass,
    id: Date.now(),
    timeout: 3000
  };
  return axios.post("http://127.0.0.1:7783", requestData)
    .then(res => {
      console.log(res.data)
      return res.data
    })
    .catch(err => console.error(err))
}

function enable_etherc20(coin, swap_contract_address, userpass = up) {
  console.log("enable eth/erc20: " )
  const requestData = {
    jsonrpc: "2.0",
    method: "electrum",
    coin: coin,
    urls:["http://eth1.cipig.net:8555", "http://eth2.cipig.net:8555", "http://eth3.cipig.net:8555"],
    swap_contract_address: swap_contract_address,
    gas_station_url: "https://ethgasstation.info/json/ethgasAPI.json",
    //servers: servers,
    userpass: userpass,
    id: Date.now(),
    timeout: 3000
  };
  return axios.post("http://127.0.0.1:7783", requestData)
    .then(res => {
      console.log(res.data)
      return res.data
    })
    .catch(err => console.error(err))
}

//enable_coin(res.coin)
