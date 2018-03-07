import express from 'express'
import { middleware, Client } from '@line/bot-sdk'
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
const profileTemplate = fs.readFileSync('./static/templates/profile.html', 'utf8')

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

app.get('/demo/dynamiclink', (req, res) => {
  const userId = req.query.userId
  const appCode = process.env.APP_CODE
  const apn = process.env.APN
  const redirectUrl = `https://${appCode}.app.goo.gl/?apn=${apn}&link=${baseUrl}/profile?userId=${userId}`
  res.redirect(redirectUrl)
})

app.get('/demo/instantapp', (req, res) => {
  const userId = req.query.userId
  const redirectUrl =
    'intent://hotpads.com/indigo-at-twelve-west-portland-or-97205-skfrgn/pad#Intent;scheme=https;end'
  res.redirect(redirectUrl)
})

app.get('/demo/chrome', (req, res) => {
  const userId = req.query.userId
  let redirectUrl = `intent://${baseUrl.replace(/https:\/\//, '')}/profile?userId=${userId}#Intent;scheme=https;package=com.android.chrome;end`
  if(req.headers['user-agent'].search(/iPhone/g) > 0 || req.headers['user-agent'].search(/iPad/g) > 0) {
    redirectUrl = `googlechrome://${baseUrl.replace(/https:\/\//, '')}/profile?userId=${userId}`
  }
  res.redirect(redirectUrl)
})

app.post('/webhook', middleware(config), async (req, res) => {
  await new bot(client, req.body.events).start()
  res.send('A_A')
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Line BOT server has been started!')
})
