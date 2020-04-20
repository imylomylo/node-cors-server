// ES6+ not supported in nodejs by default
import jl777coins from './jl777coins/index.js'
import axios from 'axios'
const UP  = "testing"

/**
 * @api {get} /getOrders
 * @apiName getOrders
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 my_orders to get current orders
 * 
 */
export function getOrders(userpass = UP) {
  console.log("getOrders")
  const requestData = {
    jsonrpc: "2.0",
    method: "my_orders",
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

/**
 * @api {get} /getRecentSwaps
 * @apiName getRecentSwaps
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} userpass default up set in config
 * @apiParam {String} uuid  default is null to get all
 * 
 * @apiDescription mm2 my_recent_swaps to get current orders
 * 
 */
export function getRecentSwaps(uuid = null, userpass = UP) {
  console.log("getRecentSwaps")
  const requestData = {
    jsonrpc: "2.0",
    method: "my_recent_swaps",
    uuid: uuid,
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

/**
 * @api {get} /getEnabledCoins
 * @apiName getEnabledCoins
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 get_enabled_coins to get current state of enabled coins
 * 
 */
export function getEnabledCoins(userpass = UP) {
  console.log("GetEnabledCoins")
  const requestData = {
    jsonrpc: "2.0",
    method: "get_enabled_coins",
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

/**
 * @api {get} /connectCoin
 * @apiName connectCoin
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} coin default up set in config
 * @apiParam {Object[]} servers passed from previous lookup
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 connect coin with electrum server
 * 
 */
export function connectCoin(coin, servers, userpass = UP) {
  console.log("connect coin: " + coin + " with servers " + servers)
  const requestData = {
    jsonrpc: "2.0",
    method: "electrum",
    coin: coin,
    servers: JSON.parse(servers),
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

/**
 * @api {get} /buy
 * @apiName buy
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} base
 * @apiParam {String} rel
 * @apiParam {String} price
 * @apiParam {String} volume
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 be an alice (taker) by calling mm2 buy method
 * 
 */
export function buy(base, rel, price, volume, userpass = UP){
  console.log("buy (base,rel,price,volume): (" + base + "," + rel + "," + price + "," + volume + ")")
  const requestData = {
    jsonrpc: "2.0",
    method: "buy",
    base: base,
    rel: rel,
    price: price,
    volume: volume,
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

/**
 * @api {get} /setPrice
 * @apiName setPrice
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} base
 * @apiParam {String} rel
 * @apiParam {String} price
 * @apiParam {String} volume
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 be a bob (maker) by calling mm2 setprice method
 * 
 */
export function setPrice(base, rel, price, volume, userpass = UP){
  console.log("buy (base,rel,price,volume): (" + base + "," + rel + "," + price + "," + volume + ")")
  const requestData = {
    jsonrpc: "2.0",
    method: "setprice",
    base: base,
    rel: rel,
    price: price,
    volume: volume,
    cancel_previous: false,
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

/**
 * @api {get} /withdraw
 * @apiName withdraw
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} coin
 * @apiParam {String} to
 * @apiParam {String} amount
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 be a bob (maker) by calling mm2 withdraw method
 * 
 */
export function withdraw(coin, to, amount, userpass = UP){
  console.log("withdraw (coin,to,amount): (" + coin + "," + to + "," + amount + "," + volume + ")")
  const requestData = {
    jsonrpc: "2.0",
    method: "withdraw",
    coin: coin,
    to: to,
    amount: amount,
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

/**
 * @api {get} /getBalance
 * @apiName getBalance
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} coin
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 my_balance to get current balance of coin
 * 
 */
export function getBalance(coin, userpass = UP) {
  console.log("getBalance coin: " + coin)
  const requestData = {
    jsonrpc: "2.0",
    method: "my_balance",
    coin: coin,
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

/**
 * @api {get} /getMarket
 * @apiName getMarket
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} base
 * @apiParam {String} rel
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 orderbook method to get market data (orderbooks) for base/rel
 * 
 */
export function getMarket(base, rel, userpass = UP) {
  console.log("market data: " + base + " / " + rel)
  const requestData = {
    jsonrpc: "2.0",
    method: "orderbook",
    base: base,
    rel: rel,
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

/**
 * @api {get} /order_status
 * @apiName order_status
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {String} uuid
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 orderbook method to get market data (orderbooks) for base/rel
 * 
 */
export function order_status(uuid, userpass = UP) {
  console.log("order_status: " + uuid )
  const requestData = {
    jsonrpc: "2.0",
    method: "order_status",
    uuid: uuid,
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

/**
 * @api {get} /cancel_all_orders
 * @apiName cancel_all_orders
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {Object} cancelAll an object with attribute type set to All
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 orderbook method to cancel all orders
 * 
 */
export function cancel_all_orders(cancelAll, userpass = UP) {
  const objCancelAll = { type: 'All'};
  console.log("cancel_all_orders: " )
  const requestData = {
    jsonrpc: "2.0",
    method: "cancel_all_orders",
    cancel_by: objCancelAll,
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

/**
 * @api {get} /cancel_order
 * @apiName cancel__order
 * @apiGroup MarketmakerRequest
 *
 * @apiParam {Object} cancelAll an object with attribute type set to All
 * @apiParam {String} userpass default up set in config
 * 
 * @apiDescription mm2 orderbook method to cancel all orders
 * 
 */
export function cancel_order(uuid, userpass = UP) {
  const objCancelAll = { type: 'All'};
  console.log("cancel_all_orders: " )
  const requestData = {
    jsonrpc: "2.0",
    method: "cancel_order",
    uuid: uuid,
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

export default {
  getOrders,
  getRecentSwaps,
  getEnabledCoins,
  connectCoin,
  buy,
  setPrice,
  withdraw,
  getBalance,
  getMarket,
  order_status,
  cancel_all_orders,
  cancel_order
}
