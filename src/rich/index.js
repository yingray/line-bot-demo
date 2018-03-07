import _ from 'lodash'
import controller from './controller.json'
import fs from 'fs'

class RichMenu {
  constructor(client) {
    this.id = ''
    this.init(client)
  }

  async init(client) {
    const list = await client.getRichMenuList()
    console.log(list)
    list.forEach(element => {
      if (element.name === 'Controller') {
        client.deleteRichMenu(element.richMenuId)
      }
    })
    this.id = await client.createRichMenu(controller)
    const image = fs.createReadStream('./static/images/rich/controller.jpg')
    await client.setRichMenuImage(this.id, image, 'image/jpeg')
  }

  getRichId() {
    return this.id
  }
}

export default RichMenu
