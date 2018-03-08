import _ from 'lodash'

const dir = {
  sayHi: ['鯨魚', '安安', '嗨', 'hi', 'hello'],
  sad: ['幹', '媽的', '不告訴你'],
  eatWhat: ['吃什麼'],
  whoAreU: ['你是誰', '你誰', '你是', '？'],
  haha: ['哈哈', '呵呵', 'haha', 'lol']
}

const dirMap = {
  sayHi: ['你好', '什麼事？', '愛你喔！', '叫我嗎？', '嗨！', '安安！', '真的很愛我喔A_A'],
  sad: ['抱歉...', '別這樣...', '對不起麻...', 'QQ', '不要欺負可憐小鯨魚T_T'],
  eatWhat: ['好啦我幫你想，你把你位置傳給我！😠', '隨便', '你想', '人生好難'],
  whoAreU: ['小鯨魚', '本鯨魚', '我是小鯨魚，請多多指教', '叫 我 小 鯨 魚 ！'],
  haha: ['笑什麼', '什麼東西這麼好笑，我想知道'],
  waitToEat: ['幫你找吃的...', '每次都要我想...', '好啦，幫你想就是了...', '又要我想...QQ', '我知道有一家，我想一下...', '想一下...', '讓我來為你推一家...']
}

const list = _.flattenDeep(_.map(dir, v => v))

export const isSpeaking = text => {
  let result = false
  list.forEach(element => {
    if (text.search(new RegExp(element)) >= 0) {
      result = true
    }
  })
  return result
}

export const getSpeakingText = text => {
  let items
  if(text === 'get_eating_speaking') {
    items = dirMap['waitToEat']
  } else {
    _.map(dir, (v, k) => {
      _.map(v, element => {
        if (text.search(new RegExp(element)) >= 0) {
          items = dirMap[k]
        }
      })
    })
  }
  const item = items[Math.floor(Math.random() * items.length)]
  return item
}
