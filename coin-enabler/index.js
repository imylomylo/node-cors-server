'use strict';

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

// works find single by coin
//let res = coins.find( x => x.coin === 'RFOX')
//console.log(res)
	
// works find single erc20
//res = coins.find( x => x.coin === 'BUSD')
//enable_etherc20(res.coin, res.etomic)

// works filter for mm2 enabled
//let res = coins.filter( x => x.mm2 === 1)
//console.log(res)

// works filter coin & mm2 enabled
//let onlycoin = coins.filter( x => !x.etomic )
//res = onlycoin.filter( x => x.mm2 === 1)

// works filter erc20 & mm2
//let erc20 = coins.filter( x => x.etomic )
//res = erc20.filter( x => x.mm2 === 1)

// works loop through res
//for( let i = 0 ; i < res.length ; i++){
//  console.log("ERC20")
//  console.log("COIN")
//  console.log(res[i])
//}

// works add single coin
//electrum = {}
//fs.readFile('coins/electrums/'+res.coin, (err, data) => {
//    if (err) throw err
//    electrum = JSON.parse(data)
//    console.log(res)
//    console.log(electrum)
//    enable_electrum(res.coin, electrum)
//})

// works add single erc20
//    enable_erc20(res.coin, res.etomic)
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
