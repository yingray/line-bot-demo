import _ from 'lodash'

class ImageMap {
  constructor(config, baseUrl, actions) {
    return {
      type: 'imagemap',
      baseUrl: baseUrl + config.baseUrl,
      altText: config.altText,
      baseSize: config.baseSize,
      actions: this.getActions(config.areas, actions)
    }
  }

  getActions(areas, actions) {
    if (areas.length !== actions.length) {
      throw "area's length wrong!"
    }
    return _.map(areas, (area, index) => Object.assign({}, actions[index], { area }))
  }
}

export default ImageMap
