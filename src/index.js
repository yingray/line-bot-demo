import express from 'express'
import { middleware, JSONParseError, SignatureValidationFailed, Client } from '@line/bot-sdk'
import dotenv from 'dotenv'
import fs from 'fs'
import _ from 'lodash'
import mustache from 'mustache'

import bot from './bot'

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
const profileTemplate = fs.readFileSync('./src/templates/profile.html', 'utf8')

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
    mustache.parse(profileTemplate)
    const html = mustache.render(profileTemplate, {
      name: profile.displayName || '',
      status: profile.statusMessage || '',
      image: profile.pictureUrl
    })
    res.send(html)
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
  // const userId = req.body.events[0].source.userId
  await new bot(client, req.body.events).start()
  res.send('A_A')
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Line BOT server has been started!')
})
