'use strict';

import fs from 'fs'
import axios from 'axios'
const UP = 'testing'

export default function jl777coins(__dirname) {

let res = ''
let electrum = ''
fs.readFile(__dirname + '/jl777coins/coins/coins', (err, data) => {
    if (err) throw err;
    let coins = JSON.parse(data);
    
// ##################################################
// INITIAL INVESTIGATION

// works read file and print contents to screen
//let rawdata = fs.readFileSync('coins');
//let coins = JSON.parse(rawdata);
//console.log(coins);

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
//    enable_etherc20(res.coin, res.etomic)

// ################################################

// filter erc20 & mm2
    let erc20 = coins.filter( x => x.etomic )
    res = erc20.filter( x => x.mm2 === 1)

// loop through ETH res
    for( let i = 0 ; i < res.length ; i++){
      console.log("ERC20")
      console.log(res[i])
      enable_etherc20(res[i].coin,res[i].etomic)
    }

// filter coin & mm2 enabled
    let onlycoin = coins.filter( x => !x.etomic )
    res = onlycoin.filter( x => x.mm2 === 1)

// loop through COIN res
    for( let i = 0 ; i < res.length ; i++){
      console.log("COIN: " + res[i].coin)
      electrum = ''
      try { 
      fs.readFile(__dirname + '/jl777coins/coins/electrums/'+res[i].coin, (err, data) => {
        if (err) { 
          console.error("ERROR: Likely no electrum for this coin. " + err.stack )
          return
        }
        if (data != 'undefined') {
          res[i].servers = JSON.parse(data)
          console.log(res[i])
          enable_electrum(res[i].coin,res[i].servers)
        }
      })
      } catch(e) {
        console.error("ERROR: Electrum file reading error for this coin. " + e)
      }
    }

});

}

function enable_electrum(coin, servers, userpass = UP) {
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

function enable_etherc20(coin, swap_contract_address, userpass = UP) {
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
