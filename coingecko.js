// cat coingecko.coinlist.json | jq '.[] | select (.id=="litecoin")'

const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
let func = async() => {
  let data = await CoinGeckoClient.coins.fetch('verus-coin', {});
  console.log(JSON.stringify(data,null,4))
  // node coingecko.js > coingecko.log
  // cat coingecko.log | jq '.data.tickers[] | "\(.market.name) \(.bid_ask_spread_percentage)"'
  // cat coingecko.log | jq '.data.market_data.current_price'
}

func()

