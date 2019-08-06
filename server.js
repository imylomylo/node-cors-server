// import express from "express"
const express = require("express");
import cors from "cors"
app = express();
import mm2 from './mm2rpc'

app.use(cors())
/* -------------------------------------------------------------------------- */

app.get("/no-cors", (req, res) => {
  console.info("GET /no-cors");
  res.json({
    text: "You should not see this via a CORS request."
  });
});

/* -------------------------------------------------------------------------- */

app.head("/simple-cors", cors(), (req, res) => {
  console.info("HEAD /simple-cors");
  res.sendStatus(204);
});
app.get("/simple-cors", cors(), (req, res) => {
  console.info("GET /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [GET]"
  });
});
app.post("/simple-cors", cors(), (req, res) => {
  console.info("POST /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [POST]"
  });
});

/* -------------------------------------------------------------------------- */

app.options("/complex-cors", cors());
app.delete("/complex-cors", cors(), (req, res) => {
  console.info("DELETE /complex-cors");
  res.json({
    text: "Complex CORS requests are working. [DELETE]"
  });
});

/* -------------------------------------------------------------------------- */

const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600
};
app.options("/issue-2", cors(issue2options));
app.post("/issue-2", cors(issue2options), (req, res) => {
  console.info("POST /issue-2");
  res.json({
    text: "Issue #2 is fixed."
  });
});

/* -------------------------------------------------------------------------- */

if (!module.parent) {
  const port = process.env.PORT || 7780;

  app.listen(port, () => {
    console.log("Express server listening on port " + port + ".");
    runloop();
  });
}


app.get("/config", cors(), (req, res) => {
  console.info("GET /config");
  let fs = require('fs');

  let contents = fs.readFileSync('mpm.json', 'utf8');
  console.log(contents);
  res.json(
    JSON.parse(contents)
  );
});

app.options("/coinsenabled", cors())
app.get("/coinsenabled", cors(), (req,res) => {
  console.info("GET /coinsenabled")
  return mm2.getEnabledCoins()
})

app.options("/test/coinsenabled", cors())
app.get("/test/coinsenabled", cors(), (req,res) => {
  console.info("GET /test/coinsenabled")
  res.json(
    JSON.stringify(
      {
        result: [
          {
            address: "RG7mQ5unWefSiiujFouxqSN6Go7WT5hBqq",
            ticker: "MORTY"
          },
          {
            address: "RG7mQ5unWefSiiujFouxqSN6Go7WT5hBqq",
            ticker: "RICK"
          }
        ]
      }
    )
  )
})

app.get("/getbinancemarketprice", cors(), (req, res) => {
  console.info("GET /getbinancemarketprice");
  axiosGET("https://api.binance.com/api/v3/ticker/price?symbol=KMDBTC").then(data => {
    res.json(
      data
    );
  })
});

app.get("/getbinancemarketdepth", cors(), (req, res) => {
  console.info("GET /getbinancemarketdepth");
  axiosGET("https://api.binance.com/api/v1/depth?symbol=KMDBTC&limit=20").then(data => {
    res.json(
      data
    );
  })
});


app.get("/getpaprikaprice", cors(), (req, res) => {
  console.info("GET /getpaprikaprice");
  axiosGET("https://api.coinpaprika.com/v1/price-converter?base_currency_id=kmd-komodo&quote_currency_id=btc-bitcoin&amount=1").then(data => {
    res.json(
      data
    );
  })
});


const axios = require('axios');

function axiosGET(url){
  return axios.get(url).then(response => {
    return response.data
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runloop() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  let i = 0
  // Sleep in loop
  for (let i = 0; i  < 10; i++) {
    await sleep(2000);
    if( i == 5 ){
      bringOrdersToIntegrity()
      i = 0
    }
    console.log(i);
  }
}

function bringOrdersToIntegrity(){
  console.log("Bringing order to interity")
}
