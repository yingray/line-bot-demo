import fetch from 'node-fetch'
import _ from 'lodash'

export const getFoodMessages = async (long, lat) => {
  const item = await searchFood(long, lat)
  const messages = [
    {
      type: 'text',
      text: giveComment(item.rating)
    },
    {
      type: 'location',
      title: item.name,
      address: item.vicinity,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng
    }
  ]
  if (item.photos.length > 0) {
    messages.push({
      type: 'image',
      originalContentUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1024&photoreference=${
        item.photos[0].photo_reference
      }&key=${process.env.GOOGLE_API_KEY}`,
      previewImageUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=240&photoreference=${
        item.photos[0].photo_reference
      }&key=${process.env.GOOGLE_API_KEY}`
    })
  }
  return messages
}

const giveComment = rating => {
  if (rating >= 4) {
    return `我找到了，有一家評價很不錯的店唷~ 星星數: ${rating}`
  } else if (rating >= 3) {
    return `找到了一家普通吃的店 星星數: ${rating}`
  } else {
    return `你都不想啊，找一家難吃的店給你參考 星星數: ${rating}`
  }
}

const searchFood = async (long, lat) => {
  const { results } = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=500&types=food&key=${
      process.env.GOOGLE_API_KEY
    }`
  ).then(response => response.json())
  console.log(results)
  const items = _.filter(results, i => i.types.includes('food'))
  const item = items[Math.floor(Math.random() * items.length)]
  console.log(item)
  return item
}
