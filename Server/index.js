const express = require("express")
const app = express()

//check data change
var globalVersion = 0
var companies = {
  "mngame1":{"subscribers":0},
  "mngame2":{"subscribers":0},
  "mngame3":{"subscribers":0},
}

app.get("/subscribe/:companyId", (req, res) => {
    companies[req.params.companyId].subscribers++
    globalVersion++
    res.status(200).json({"message":`subscribed to company ${req.params.companyId}`})
})

app.get("/sse", (req, res) => {
    var localVersion = 0
    res.set("Content-Type", "text/event-stream")
    res.set("Connection", "keep-alive")
    res.set("Cache-Control", "no-cache")
    res.set("Access-Control-Allow-Origin", "*")
    console.log("client connected to sse")
    setInterval(function(){
        // khi data thay doi => gui ve client, ko phai luc nao cung gui
      if(localVersion < globalVersion){
        res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`)
        localVersion = globalVersion
      }
    }, 100)
  })

app.listen(3000, err => {
    if(err){console.log("Server cannot listen..."); return}
    console.log("Server listening...")
})