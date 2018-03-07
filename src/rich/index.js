import _ from 'lodash'
import controller from './controller.json'
import spring from './spring.json'
import fs from 'fs'

class RichMenus {
  constructor(client) {
    this.controller_id = ''
    this.spring_id = ''
    this.init(client)
  }

  async init(client) {
    const list = await client.getRichMenuList()
    console.log(list)
    list.forEach(element => {
      client.deleteRichMenu(element.richMenuId)
    })
    this.controller_id = await client.createRichMenu(controller)
    const controller_image = fs.createReadStream('./static/images/rich/controller.jpg')
    await client.setRichMenuImage(this.controller_id, controller_image, 'image/jpeg')
    this.spring_id = await client.createRichMenu(spring)
    const spring_image = fs.createReadStream('./static/images/rich/spring.jpg')
    await client.setRichMenuImage(this.spring_id, spring_image, 'image/jpeg')
  }

}

export default RichMenus
