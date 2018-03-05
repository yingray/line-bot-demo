import { getMessageObj } from './intend'

class bot {
  constructor(client, events) {
    this.client = client
    this.events = events
  }

  async start() {
    console.log(this.events)
    const promises = this.events.map(this.handleEvent.bind(this))
    return promises
  }

  async handleEvent(e) {
    const userId = e.source.userId
    const client = this.client
    try {
      const message = await getMessageObj(e, client)
      return client.pushMessage(e.source.userId, message)
    } catch (err) {
      console.log(err)
      return client.pushMessage(e.source.userId, {
        type: 'text',
        text: '[ERROR]小鯨魚發生錯誤\n' + err
      })
    }
  }
}

export default bot
