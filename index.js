// ES6+ not supported in nodejs by default
// put in package.json "type": "module"
// then use node --experimental-modules index.js
import 'dotenv/config.js'
import jl777coins from './jl777coins/index.js'
import mm2middleware from './mm2-middleware.js'
import CoinGecko from 'coingecko-api'
import express from "express"
import cors from "cors"
import bodyParser from 'body-parser'
import axios from 'axios'
import fs from 'fs'
const up = "testing"
let liveConfig = fsGetConfig()
let app = express();
app.use(cors())
app.use(bodyParser.json())

// web server starting
const port = process.env.PORT || 7780;
app.listen(port, () => {
  console.log("Express server listening on port " + port + ".")
//  jl777coins(process.cwd())
  runloop()
});
// END

// #############################################################

// re-used functions
/**
 * @apiName AxiosGET
 * @apiGroup Utility
 *
 * @apiDescription Re-usable utility method.
 *
 * @apiParam {String} url the url to hit with the request
 */
function axiosGET(url) {
  return axios.get(url).then(response => {
    return response.data
  })
}

/**
 * @api {post} / 
 * @apiName sleep
 * @apiGroup Utility
 *
 * @apiDescription A way to make nodejs sleep.
 *
 * @apiParam {Number} ms the time in milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// marketmaker strategy update loop & order integrity

/**
 * @api {post} / 
 * @apiName runloop
 * @apiGroup Orchestration
 *
 * @apiDescription Runnable method that loops ad-infinitum keeping marketmaking user activities running.
 *
 */
async function runloop() {

  console.log('Taking a break...')
  await sleep(5000)
  jl777coins(process.cwd())
  console.log('Five seconds later, showing sleep in a loop...')

  let i = 0
  // Sleep in loop
  for (let i = 0; i < 10; i++) {
    await sleep(2000);
    if (i == 3) {
      getCoinGeckoData()
// disabled feature not used
//      bringOrdersToIntegrity()
    }
    if (i == 9) {
// disabled feature not used
//      saveLiveConfig()
      i = 0
    }
    console.log(i);
  }
}

/**
 * @api {post} / 
 * @apiName saveLiveConfig
 * @apiGroup Utility
 *
 * @apiDescription Writes the live config to a file so for persistence.
 *
 */
function saveLiveConfig() {
  const snapshot = liveConfig
  fs.writeFile("output.json", JSON.stringify(snapshot), 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      console.log(err);
    } else {
      console.log("JSON file has been saved.");
    }
  });
}

/**
 * @api {post} / 
 * @apiName saveJSON
 * @apiGroup Utility
 *
 * @apiDescription Writes the JSON data to filesystem
 *
 */
function saveJSON(data, filename) {
  fs.writeFile(filename, JSON.stringify(data), 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      console.log(err);
    } else {
      console.log("JSON file has been saved.");
    }
  });
}

/**
 * @api {post} / 
 * @apiName getCoinGeckoData
 * @apiGroup Utility
 *
 * @apiDescription Method that gets updated prices and CEX spreads for informational purposes.
 *
 */
async function getCoinGeckoData() {
  console.log("COIN GECKO BEGIN")
  //const CoinGecko = require('coingecko-api')
  const CoinGeckoClient = new CoinGecko()
  let rawdata = {}
  let data = {}
  // check coingecko.js how the next section works out

  try {
    rawdata = await CoinGeckoClient.coins.fetch('komodo', {}) // KMD, komodo
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.KMD.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('verus-coin', {}) // VRSC, verus-coin
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.VRSC.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('chips', {}) // CHIPS, chips
    data = rawdata
//  data = {}
//  data.current_prices = rawdata.data.market_data.current_price
//  data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.CHIPS.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('litecoin', {}) // LTC, litecoin
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.LTC.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('bitcoin', {}) // BTC, bitcoin
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.BTC.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('dash', {}) // DASH, dash
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.DASH.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('dogecoin', {}) // DOGE, dogecoin
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.DOGE.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('digibyte', {}) // DGB, digibyte
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.DGB.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('zcash', {}) // ZEC, zcash
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.ZEC.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('ravencoin', {}) // RVN, ravencoin
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.RVN.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('hush', {}) // HUSH, hush
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.HUSH.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('utrum', {}) // OOT, utrum
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.OOT.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  try {
    rawdata = await CoinGeckoClient.coins.fetch('qtum', {}) // QTUM, qtum
    data = {}
    data.current_prices = rawdata.data.market_data.current_price
    data.cex_spreads = rawdata.data.tickers
    saveJSON(data, "COINGECKO.QTUM.json")
  } catch (error) {
    console.log("HANDLED BETTER")
  }

  console.log("COIN GECKO END")
}

/**
 * @api {post} / 
 * @apiName bringOrdersToIntegrity
 * @apiGroup Orchestration
 *
 * @apiDescription Stub method that would normally call updated prices then apply the marketmaking strategy on live orders by adjusting prices.
 *
 */
function bringOrdersToIntegrity() {
  console.log("Bringing order to interity")
  getCEXPrices()
}

/**
 * @api {post} / 
 * @apiName getCEXPrices
 * @apiGroup Utility
 *
 * @apiDescription Gets the price of the configured CEX & aggregator feeds, updating the live config to reflect market changes.
 */
function getCEXPrices() {
  let config = getLiveConfig()
  for (let key in config) {
    if (config.hasOwnProperty(key)) {
      // console.log(key + " -> " + JSON.stringify(config[key]));
      if (config[key].ticker != "BTC") {
        if (config[key].binance) {
          axiosGET("https://api.binance.com/api/v3/ticker/price?symbol=" + config[key].ticker + "BTC").then(data => {

            // console.log(data)
            config[key].cexprice = data.price
            config[key].price = data.price
            // console.log(config)
            liveConfig = config
            console.log(liveConfig)

          })
        }
        if (config[key].bittrex) {
          //https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-KMD
          axiosGET("https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-" + config[key].ticker).then(data => {

            // console.log(data)
            config[key].cexpricebittrex = parseFloat(data.result.Last)
            config[key].price = parseFloat(data.result.Last)
            // console.log(config)
            liveConfig = config
            console.log(liveConfig)

          })
        }
        if (config[key].papid) {
          //https://api.coinpaprika.com/v1/price-converter?base_currency_id=kmd-komodo&quote_currency_id=btc-bitcoin&amount=1
          axiosGET("https://api.coinpaprika.com/v1/price-converter?base_currency_id=" + config[key].papid + "&quote_currency_id=btc-bitcoin&amount=1").then(data => {

            // console.log(data)
            config[key].apipricepaprika = parseFloat(data.price)
            config[key].price = parseFloat(data.price)
            // console.log(config)
            liveConfig = config
            console.log(liveConfig)

          })
        }
      }
    }
  }
}

/**
 * @api {post} / 
 * @apiName getLiveConfig
 * @apiGroup Utility
 *
 * @apiDescription Safely gets the currently used configuration
 */
function getLiveConfig() {
  console.log("Passing Live Config")
  return liveConfig
}

/**
 * @api {post} / 
 * @apiName fsGetConfig
 * @apiGroup Utility
 *
 * @apiDescription Gets the config file from disk
 */
function fsGetConfig() {
  return JSON.parse(fs.readFileSync('mmconfig.json', 'utf8'));
}

// url routes
/**
 * @api {get} /config
 * @apiName config
 * @apiGroup URLRoutes
 *
 * @apiDescription Gets the config file for the network client/tui/gui/app
 * 
 * @deprecated
 */
app.options("/config", cors())
app.get("/config", cors(), (req, res) => {
  console.info("GET /config");
  // let fs = require('fs');

  // let contents = fs.readFileSync('mpm.json', 'utf8');
  let contents = fsGetConfig()
  console.log(contents);
  res.json(
    contents
  );
});

/**
 * @api {get} /config2
 * @apiName config2
 * @apiGroup URLRoutes
 *
 * @apiDescription Gets the config file for the network client/tui/gui/app using the safer getLiveConfig method
 * 
 */
app.options("/config2", cors())
app.get("/config2", cors(), (req, res) => {
  console.info("GET /config2");
  // let fs = require('fs');

  // let contents = fs.readFileSync('mmconfig.json', 'utf8');
  let contents = getLiveConfig()
  // console.log(contents);
  res.json(
    contents
  );
});

/**
 * @api {post} /config
 * @apiName config
 * @apiGroup URLRoutes
 *
 * @apiDescription Saves the updated config submission from the client
 * 
 */
app.options("/config", cors())
app.post("/config", cors(), (req, res) => {
  console.info("POST /config");
  console.log(req.body)

  fs.writeFile("output.json", JSON.stringify(req.body), 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      console.log(err);
      res.status(500).json({
        result: "failure"
      })
    } else {
      console.log("JSON file has been saved.");
      res.status(201).json({
        result: "success"
      })
    }
  });
});

/**
 * @api {get} /coinconfig
 * @apiName coinconfig
 * @apiGroup URLRoutes
 *
 * @apiParam {String} coin as a ticker symbol, e.g. KMD, BTC etc.
 * @apiDescription Gets the coin configuration (which for this PoC was separate to the app config)
 */
app.get("/coinconfig", cors(), (req, res) => {
  console.info("GET /coinconfig");
  console.info("query param" + req.query.coin)
  // let fs = require('fs');
  let contents = ''
  try {
    contents = fs.readFileSync(req.query.coin, 'utf8');
  } catch (e) {
    contents = '{"error": "no config"}'
  }
  console.log(contents);
  res.json(
    JSON.parse(contents)
  );
});

/**
 * @api {get} /coinsenabled
 * @apiName coinsenabled
 * @apiGroup URLRoutes
 *
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API
 * 
 */
app.options("/coinsenabled", cors())
app.get("/coinsenabled", cors(), (req, res) => {
  console.info("GET /coinsenabled")
  mm2middleware.getEnabledCoins().then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {post} /connectcoin
 * @apiName connectcoin
 * @apiGroup URLRoutes
 *
 * @apiParam {String} coin as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {String[]} server information for connecting using marketmaker2.electrum method
 * 
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API
 * 
 */
app.options("/connectcoin", cors())
app.post("/connectcoin", cors(), (req, res) => {
  console.info("GET /connectcoin " + req.query.coin + " " + req.query.servers)
  mm2middleware.connectCoin(req.query.coin, req.query.servers).then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {get} /recentswaps
 * @apiName recentswaps
 * @apiGroup URLRoutes
 *
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API
 * 
 */
app.options("/recentswaps", cors())
app.get("/recentswaps", cors(), (req, res) => {
  console.info("GET /recentswaps")
  mm2middleware.getRecentSwaps().then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {get} /getBalance
 * @apiName getBalance
 * @apiGroup URLRoutes
 *
 * @apiParam {String} coin as a ticker symbol, e.g. KMD, BTC etc.
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API
 * 
 */
app.options("/getBalance", cors())
app.get("/getBalance", cors(), (req, res) => {
  console.info("GET /getBalance " + req.query.coin)
  mm2middleware.getBalance(req.query.coin).then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {get} /getOrders
 * @apiName getOrders
 * @apiGroup URLRoutes
 *
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API
 * 
 */
app.options("/getOrders", cors())
app.get("/getOrders", cors(), (req, res) => {
  console.info("GET /getOrders ")
  mm2middleware.getOrders().then(data => {
    console.log("return to client" + JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {post} /doTaker
 * @apiName doTaker
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {String} rel as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {Number} price in BTC e.g. 0.00007777
 * @apiParam {Number} volume in amount of coins of base(?)
 * 
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API.  Specifically this performs a mm2.buy()
 * 
 */
app.options("/doTaker", cors())
app.post("/doTaker", cors(), (req, res) => {
  if(process.env.ME_PUBLIC) {
    res.send(405, 'Method Not Allowed')
  }
  let base = req.query.base
  let rel = req.query.rel
  let price = req.query.price
  let volume = req.query.volume
  console.info("GET /doTaker " + base + " " + rel + " " + price + " " + volume)
  if( base == undefined || rel == undefined || price == undefined || volume == undefined ){
    console.log("doTaker undefined")    
  }
  mm2middleware.buy(base, rel, price, volume).then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {post} /doMaker
 * @apiName doMaker
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {String} rel as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {Number} price in BTC e.g. 0.00007777
 * @apiParam {Number} volume in amount of coins of base(?)
 * 
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API.  Specifically this performs a mm2.buy()
 * 
 */
app.options("/doMaker", cors())
app.post("/doMaker", cors(), (req, res) => {
  if(process.env.ME_PUBLIC) {
    res.send(405, 'Method Not Allowed')
  }
  let base = req.query.base
  let rel = req.query.rel
  let price = req.query.price
  let volume = req.query.volume
  console.info("GET /doMaker " + base + " " + rel + " " + price + " " + volume)
  if( base == undefined || rel == undefined || price == undefined || volume == undefined ){
    console.log("doMaker undefined")    
  }
  mm2middleware.setPrice(base, rel, price, volume).then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

/**
 * @api {post} /cancelOrder
 * @apiName cancelOrder
 * @apiGroup URLRoutes
 *
 * 
 * @apiDescription Calls marketmaker method to cancel all orders
 * 
 */
app.options("/cancelOrder", cors())
app.post("/cancelOrder", cors(), (req, res) => {
  if(process.env.ME_PUBLIC) {
    res.send(405, 'Method Not Allowed')
  }
  let uuid = req.query.uuid
  console.info("post /cancelOrder "  + uuid )
  mm2middleware.cancel_order(uuid).then(data => {
    console.log("return to client" + data)
    res.json(data)
  })
})

/**

/**
 * @api {post} /cancelAllOrders
 * @apiName cancelAllOrders
 * @apiGroup URLRoutes
 *
 * 
 * @apiDescription Calls marketmaker method to cancel all orders
 * 
 */
app.options("/cancelAllOrders", cors())
app.get("/cancelAllOrders", cors(), (req, res) => {
  if(process.env.ME_PUBLIC) {
    res.send(405, 'Method Not Allowed')
  }
  console.info("post /cancelAllOrders " )
  mm2middleware.cancel_all_orders("mockObj").then(data => {
    console.log("return to client" + data)
    res.json(data)
  })
})

/**
 * @api {post} /withdraw
 * @apiName withdraw
 * @apiGroup URLRoutes
 *
 * @apiParam {String} coin as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {String} to address sending to
 * @apiParam {Number} price in coin e.g. 0.0777
 * 
 * @apiDescription Calls marketmaker method to perform action of AtomicDEX API.  Specifically this performs a mm2.withdraw()
 * 
 */
app.options("/withdraw", cors())
app.post("/withdraw", cors(), (req, res) => {
  if(process.env.ME_PUBLIC) {
    res.send(405, 'Method Not Allowed')
  }
  let coin = req.query.coin
  let to = req.query.to
  let amount = req.query.amount
  console.info("post /withdraw " + coin + " " + to + " " + amount )
  if( coin == undefined || to == undefined || amount == undefined ){
    console.log("withdraw undefined")    
  }
  mm2middlware.withdraw(coin, to, amount).then(data => {
    console.log("return to client" + data)
    res.json(data)
  })
})

/**
 * @api {get} /orderstatus
 * @apiName orderstatus
 * @apiGroup URLRoutes
 *
 * @apiParam {String} uuid the order uuid
 * 
 * @apiDescription Calls marketmaker method to get order status of AtomicDEX API.  Specifically this performs a mm2.order_status()
 * 
 */
app.options("/orderstatus", cors())
app.get("/orderstatus", cors(), (req, res) => {
  console.info("GET /orderstatus " + req.query.uuid )
  mm2middleware.order_status(req.query.uuid).then(data => {
    console.log("return to client" + data)
    res.json(data)
  })
})

/**
 * @api {post} /getMarket
 * @apiName getMarket
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * @apiParam {String} rel as a ticker symbol, e.g. KMD, BTC etc.
 * 
 * @apiDescription Calls marketmaker method to get information or perform action of AtomicDEX API.  Specifically this performs a mm2.getaaaa()
 * 
 */
app.options("/getMarket", cors())
app.post("/getMarket", cors(), (req, res) => {
  console.info("GET /getMarket " + req.query.base + " " + req.query.rel)
  mm2middleware.getMarket(req.query.base, req.query.rel).then(data => {
    console.log("return to client" + data)
    res.json(data)
  })
})

/**
 * @api {get} /getPriceCoinGecko
 * @apiName getpricecoingecko
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * 
 * @apiDescription Calls cached feed on server for USD price (others available)
 * 
 */
app.options("/getpricecoingecko", cors())
app.get("/getpricecoingecko", cors(), (req, res) => {
  console.info("GET /getpricecoingecko")
  let coin = req.query.coin
  fs.readFile('./COINGECKO.'+ coin + '.json', (err, data) => {
    if (err) {
	console.log("ERROR: Coin gecko price file not available")
        data = '{"error": "not available"}'
    }
    data = JSON.parse(data)
    res.json(
      data
    )
  })
})

/**
 * @api {get} /getbittrexmarketprice
 * @apiName getbittrexmarketprice
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * 
 * @apiDescription Calls external feed lookup
 * 
 */
app.options("/getbittrexmarketprice", cors())
app.get("/getbittrexmarketprice", cors(), (req, res) => {
  console.info("GET /getbittrexmarketprice");
  let base = req.query.base
  axiosGET("https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-" + base).then(data => {
    res.json(
      data
    );
  })
});

/**
 * @api {get} /getbinancemarketprice
 * @apiName getbinancemarketprice
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * 
 * @apiDescription Calls external feed lookup
 * 
 */
app.options("/getbinancemarketprice", cors())
app.get("/getbinancemarketprice", cors(), (req, res) => {
  console.info("GET /getbinancemarketprice");
  let base = req.query.base
  axiosGET("https://api.binance.com/api/v3/ticker/price?symbol=" + base + "BTC").then(data => {
    res.json(
      data
    );
  })
});

/**
 * @api {get} /getbinancemarketdepth
 * @apiName getbinancemarketdepth
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * 
 * @apiDescription Calls external feed lookup
 * 
 */
app.get("/getbinancemarketdepth", cors(), (req, res) => {
  console.info("GET /getbinancemarketdepth");
  axiosGET("https://api.binance.com/api/v1/depth?symbol=KMDBTC&limit=20").then(data => {
    res.json(
      data
    );
  })
});

/**
 * @api {get} /getpaprikaprice
 * @apiName getpaprikaprice
 * @apiGroup URLRoutes
 *
 * @apiParam {String} base as a ticker symbol, e.g. KMD, BTC etc.
 * 
 * @apiDescription Calls external feed lookup
 * 
 */
app.get("/getpaprikaprice", cors(), (req, res) => {
  console.info("GET /getpaprikaprice");
  let base = req.query.base
  axiosGET("https://api.coinpaprika.com/v1/price-converter?base_currency_id=" + base + "&quote_currency_id=btc-bitcoin&amount=1").then(data => {
    res.json(
      data
    );
  })
});

