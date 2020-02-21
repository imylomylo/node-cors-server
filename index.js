// ES6+ not supported in nodejs by default
// import mm2 from './mm2rpc'
// import express from "express"
// import cors from "cors"

// passing responses not working
// const mm2 = require("./mm2rpc.js")
// START
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const axios = require('axios');
const fs = require('fs');
let liveConfig = fsGetConfig()
// const up = "fLUfdB67ARM5UnIcb1NEuKCeSB5MXlBx"
const up = "testing"
app = express();
app.use(cors())
app.use(bodyParser.json())

// web server starting
if (!module.parent) {
  const port = process.env.PORT || 7780;

  app.listen(port, () => {
    console.log("Express server listening on port " + port + ".");
    runloop();
  });
}
// END

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

  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  let i = 0
  // Sleep in loop
  for (let i = 0; i < 10; i++) {
    await sleep(2000);
    if (i == 3) {
      bringOrdersToIntegrity()
    }
    if (i == 9) {
      saveLiveConfig()
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
  getEnabledCoins().then(data => {
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
  connectCoin(req.query.coin, req.query.servers).then(data => {
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
  getRecentSwaps().then(data => {
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
  getBalance(req.query.coin).then(data => {
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
  getOrders().then(data => {
    // res.json(JSON.stringify(data))
    // data = {
    //   result: {
    //     maker_orders: {
    //       "fedd5261-a57e-4cbf-80ac-b3507045e140": {
    //         base: "BEER",
    //         created_at: 1560529042434,
    //         available_amount: "1",
    //         cancellable: true,
    //         matches: {
    //           "60aaacca-ed31-4633-9326-c9757ea4cf78": {
    //             connect: {
    //               dest_pub_key:
    //                 "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //               maker_order_uuid:
    //                 "fedd5261-a57e-4cbf-80ac-b3507045e140",
    //               method: "connect",
    //               sender_pubkey:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               taker_order_uuid: "60aaacca-ed31-4633-9326-c9757ea4cf78"
    //             },
    //             connected: {
    //               dest_pub_key:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               maker_order_uuid:
    //                 "fedd5261-a57e-4cbf-80ac-b3507045e140",
    //               method: "connected",
    //               sender_pubkey:
    //                 "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //               taker_order_uuid: "60aaacca-ed31-4633-9326-c9757ea4cf78"
    //             },
    //             last_updated: 1560529572571,
    //             request: {
    //               action: "Buy",
    //               base: "BEER",
    //               base_amount: "1",
    //               dest_pub_key:
    //                 "0000000000000000000000000000000000000000000000000000000000000000",
    //               method: "request",
    //               rel: "PIZZA",
    //               rel_amount: "1",
    //               sender_pubkey:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               uuid: "60aaacca-ed31-4633-9326-c9757ea4cf78"
    //             },
    //             reserved: {
    //               base: "BEER",
    //               base_amount: "1",
    //               dest_pub_key:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               maker_order_uuid:
    //                 "fedd5261-a57e-4cbf-80ac-b3507045e140",
    //               method: "reserved",
    //               rel: "PIZZA",
    //               rel_amount: "1",
    //               sender_pubkey:
    //                 "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //               taker_order_uuid: "60aaacca-ed31-4633-9326-c9757ea4cf78"
    //             }
    //           }
    //         },
    //         max_base_vol: "1",
    //         min_base_vol: "0",
    //         price: "1",
    //         rel: "PIZZA",
    //         started_swaps: ["60aaacca-ed31-4633-9326-c9757ea4cf78"],
    //         uuid: "fedd5261-a57e-4cbf-80ac-b3507045e140"
    //       }
    //     },
    //     taker_orders: {
    //       "45252de5-ea9f-44ae-8b48-85092a0c99ed": {
    //         created_at: 1560529048998,
    //         cancellable: true,
    //         matches: {
    //           "15922925-cc46-4219-8cbd-613802e17797": {
    //             connect: {
    //               dest_pub_key:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               maker_order_uuid:
    //                 "15922925-cc46-4219-8cbd-613802e17797",
    //               method: "connect",
    //               sender_pubkey:
    //                 "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //               taker_order_uuid: "45252de5-ea9f-44ae-8b48-85092a0c99ed"
    //             },
    //             connected: {
    //               dest_pub_key:
    //                 "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //               maker_order_uuid:
    //                 "15922925-cc46-4219-8cbd-613802e17797",
    //               method: "connected",
    //               sender_pubkey:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               taker_order_uuid: "45252de5-ea9f-44ae-8b48-85092a0c99ed"
    //             },
    //             last_updated: 1560529049477,
    //             reserved: {
    //               base: "BEER",
    //               base_amount: "1",
    //               dest_pub_key:
    //                 "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //               maker_order_uuid:
    //                 "15922925-cc46-4219-8cbd-613802e17797",
    //               method: "reserved",
    //               rel: "ETOMIC",
    //               rel_amount: "1",
    //               sender_pubkey:
    //                 "5a2f1c468b7083c4f7649bf68a50612ffe7c38b1d62e1ece3829ca88e7e7fd12",
    //               taker_order_uuid: "45252de5-ea9f-44ae-8b48-85092a0c99ed"
    //             }
    //           }
    //         },
    //         request: {
    //           action: "Buy",
    //           base: "BEER",
    //           base_amount: "1",
    //           dest_pub_key:
    //             "0000000000000000000000000000000000000000000000000000000000000000",
    //           method: "request",
    //           rel: "ETOMIC",
    //           rel_amount: "1",
    //           sender_pubkey:
    //             "c213230771ebff769c58ade63e8debac1b75062ead66796c8d793594005f3920",
    //           uuid: "45252de5-ea9f-44ae-8b48-85092a0c99ed"
    //         }
    //       }
    //     }
    //   }
    // }
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
  let base = req.query.base
  let rel = req.query.rel
  let price = req.query.price
  let volume = req.query.volume
  console.info("GET /doTaker " + base + " " + rel + " " + price + " " + volume)
  if( base == undefined || rel == undefined || price == undefined || volume == undefined ){
    console.log("doTaker undefined")    
  }
  buy(base, rel, price, volume).then(data => {
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
  let base = req.query.base
  let rel = req.query.rel
  let price = req.query.price
  let volume = req.query.volume
  console.info("GET /doMaker " + base + " " + rel + " " + price + " " + volume)
  if( base == undefined || rel == undefined || price == undefined || volume == undefined ){
    console.log("doMaker undefined")    
  }
  setPrice(base, rel, price, volume).then(data => {
    console.log("return to client" + data)
    // res.json(JSON.stringify(data))
    res.json(data)
  })
})

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
  console.info("post /cancelAllOrders " )
  cancel_all_orders("mockObj").then(data => {
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
  let coin = req.query.coin
  let to = req.query.to
  let amount = req.query.amount
  console.info("post /withdraw " + coin + " " + to + " " + amount )
  if( coin == undefined || to == undefined || amount == undefined ){
    console.log("withdraw undefined")    
  }
  withdraw(coin, to, amount).then(data => {
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
  order_status(req.query.uuid).then(data => {
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
  getMarket(req.query.base, req.query.rel).then(data => {
    console.log("return to client" + data)
    res.json(data)
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

// dummy samples
// app.options("/dummy/coinsenabled", cors())
// app.get("/dummy/coinsenabled", cors(), (req, res) => {
//   console.info("GET /dummy/coinsenabled")
//   res.json(
//     JSON.stringify({
//       result: [{
//           address: "RG7mQ5unWefSiiujFouxqSN6Go7WT5hBqq",
//           ticker: "MORTY"
//         },
//         {
//           address: "RG7mQ5unWefSiiujFouxqSN6Go7WT5hBqq",
//           ticker: "RICK"
//         }
//       ]
//     })
//   )
// })


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
function getOrders(userpass = up) {
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
function getRecentSwaps(uuid = null, userpass = up) {
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
function getEnabledCoins(userpass = up) {
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
function connectCoin(coin, servers, userpass = up) {
  console.log("connect coin: " + coin + " with servers " + servers)
  const serversMORTY = [{
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
function buy(base, rel, price, volume, userpass = up){
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
function setPrice(base, rel, price, volume, userpass = up){
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
function withdraw(coin, to, amount, userpass = up){
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
function getBalance(coin, userpass = up) {
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
function getMarket(base, rel, userpass = up) {
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
function order_status(uuid, userpass = up) {
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
function cancel_all_orders(cancelAll, userpass = up) {
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
