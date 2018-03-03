const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const Client = require('@line/bot-sdk').Client
require('dotenv').config()

const app = express()

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET
}

const client = new Client(config)

app.use(middleware(config))

app.get('/', (_, res) => {
  res.send('Hi')
})

app.post('/webhook', (req, res) => {
  console.log(req.body.events)
  const p = req.body.events.map(e => {
    const userId = e.source.userId
    const message =
      e.message.text && e.message.text !== '去睡覺'
        ? { type: 'text', text: `小鯨魚的回話：${e.message.text}` || 'hello, world' }
        : {
            id: '325708',
            type: 'sticker',
            packageId: '1',
            stickerId: '1'
          }
    return client.pushMessage(userId, message)
  })
  // res.json(req.body.events) // req.body will be webhook event object
  res.send('OK')
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(process.env.PORT || 5000, () => console.log('Started!'))
