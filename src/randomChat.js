import _ from 'lodash'

class randomChat {
  constructor(users, chatpool, event, client) {
    this.users = Array.from(users)
    this.chatpool = chatpool
    this.position = 'a'
    this.chatIndex = 0
    this.userId = event.source.userId
    this.text = event.message.text
    this.client = client
  }
  isChatting() {
    const userId = this.userId
    let chat = false
    _.map(this.chatpool, (v, key) => {
      console.log('check')
      console.log('Cp:' + JSON.stringify(this.chatpool))
      console.log(userId)
      if (v && v.a === userId) {
        this.position = 'a'
        this.chatIndex = key
        chat= true
      } else if (v && v.b === userId) {
        this.position = 'b'
        this.chatIndex = key
        chat= true
      }
    })
    return chat
  }
  process() {
    const text = this.text
    switch (text) {
      case 'disconnect':
        this.disconnect()
        break
      case 'rematch':
        this.rematch()
        break
      default:
        this.pushMessage(text)
        break
    }
  }
  disconnect() {
    delete this.chatpool[this.chatIndex]
  }
  rematch() {
    this.disconnect()
    _.map(this.users, u => {
      if (u !== this.userId) {
        this.chatpool.push({
          a: this.userId,
          b: u
        })
      }
    })
    console.log('CP:' + JSON.stringify(this.chatpool))
  }
  pushMessage(text) {
    const id =
      this.position === 'a' ? this.chatpool[this.chatIndex].b : this.chatpool[this.chatIndex].a
    this.client.pushMessage(id, {
      type: 'text',
      text: '匿名者：' + text
    })
  }
}

export default randomChat

// const userId = req.body.events[0].source.userId
//   let chat = false
//   let i = 0
//   users.add(userId)
//   console.log(chatpool)
//   _.map(chatpool, (v, key) => {
//     if (v && (v.a === userId || v.b === userId)) {
//       chat = true
//       i = key
//     }
//   })
//   if (chat) {
//     const text = req.body.events[0].message.text
//     if (text === '斷開連結') {
//       delete chatpool[i]
//     } else if (text === '重新配對') {
//       _.map(Array.from(users), u => {
//         if(u !== userId) {
//           chatpool.push({
//             a: userId,
//             b: u
//           })
//         }
//       })
//     } else {
//       const herId = chatpool[i].a === userId ? chatpool[i].b : chatpool[i].a
//       console.log(userId)
//       console.log(herId)
//       await client.pushMessage(herId, {
//         type: 'text',
//         text: '匿名者：' + req.body.events[0].message.text
//       })
//     }
