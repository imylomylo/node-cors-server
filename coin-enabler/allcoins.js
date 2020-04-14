import axios from 'axios'
const up = 'testing'

function enable_coin(coin, servers, userpass = up) {
  const objCancelAll = { type: 'All'};
  console.log("cancel_all_orders: " )
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



