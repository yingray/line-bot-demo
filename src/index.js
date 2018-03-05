import express from 'express'
import { middleware, JSONParseError, SignatureValidationFailed, Client } from '@line/bot-sdk'
import dotenv from 'dotenv'
import fs from 'fs'
import _ from 'lodash'

import randomChat from './randomChat'
import bot from './bot'

const users = new Set()
const chatpool = []
const app = express()

if (process.env.DEV) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.dev'))
  for (var k in envConfig) {
    process.env[k] = envConfig[k]
  }
} else {
  dotenv.config()
}

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET
}

export const baseUrl = process.env.BASE_URL

const client = new Client(config)

app.use('/static', express.static('static'))
app.use('/.well-known', express.static('static/.well-known'))

app.get('/profile', async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    res.send('尚未登入')
    return
  }
  try {
    const profile = await client.getProfile(userId)
    res.send(`
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <h1>Name: ${profile.displayName}</h1>
    <h3>Status: ${profile.statusMessage}</h3>
    <img src="${profile.pictureUrl}" width="200" height="200">
    <a href="https://line.me/ti/p/@ghj3284p" style="
    position: fixed;
    width: 50px;
    height: 50px;
    background:  #ccc;
    right: 0;
    top: 0;
    color: black;"></a>
  `)
  } catch (err) {
    res.send('Not found')
  }
})

app.get('/instantapp', (req, res) => {
  res.redirect(
    'intent://hotpads.com/indigo-at-twelve-west-portland-or-97205-skfrgn/pad#Intent;scheme=https;end'
  )
})

app.post('/webhook', middleware(config), async (req, res) => {
  const userId = req.body.events[0].source.userId
  users.add(userId)
  const rc = new randomChat(users, chatpool, req.body.events[0], client)
  if (rc.isChatting() || req.body.events[0].message.text === 'rematch') {
    rc.process()
  } else {
    await new bot(client, req.body.events).start()
  }
  res.send('A_A')
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Line BOT server has been started!')
})
