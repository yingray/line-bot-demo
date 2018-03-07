import { baseUrl } from './index'
import ImageMap from './model/ImageMap'
import imagemapConfig from './config/imagemap.json'
import {
  INTEND_GET_STICKER,
  INTEND_ECHO,
  INTEND_GET_MY_PROFILE,
  INTEND_GET_LOCATION,
  INTEND_GET_POSTBACK,
  INTEND_GET_BEACON,
  INTEND_GET_IMAGE_MAP,
  INTEND_GET_INSTANT_APP_LINK,
  INTEND_GET_DYNAMIC_LINK,
  INTEND_GET_BUTTON_TEMPLATE
} from './constants'

const sticker = {
  id: '325708',
  type: 'sticker',
  packageId: '1',
  stickerId: '1'
}

const getSticker = () => sticker

const getProfileMessage = userId => {}

const getEcho = message => {}

const getIntend = e => {
  const { message } = e
  if (message.text) {
    switch (message.text
      .trim()
      .toLowerCase()
      .replace(/\ /g, '')) {
      case '去睡覺':
        return INTEND_GET_STICKER
      case 'profile':
        return INTEND_GET_MY_PROFILE
      case 'menu':
        return INTEND_GET_POSTBACK
      case 'beacon':
        return INTEND_GET_BEACON
      case 'location':
        return INTEND_GET_LOCATION
      case 'imagemap':
        return INTEND_GET_IMAGE_MAP
      case 'instantapp':
        return INTEND_GET_INSTANT_APP_LINK
      case 'dynamiclink':
        return INTEND_GET_DYNAMIC_LINK
      case 'button':
      case 'template':
        return INTEND_GET_BUTTON_TEMPLATE
      default:
        return INTEND_ECHO
    }
  } else {
    return INTEND_GET_STICKER
  }
}

const later = delay => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay)
  })
}

export const getMessageObj = async (e, client) => {
  const intend = getIntend(e)
  const userId = e.source.userId
  switch (getIntend(e)) {
    case INTEND_GET_STICKER:
      return sticker
    case INTEND_GET_MY_PROFILE:
      await client.pushMessage(userId, {
        type: 'text',
        text: '請稍候...'
      })
      await later(2000)
      const profile = await client.getProfile(userId)
      await client.pushMessage(userId, {
        type: 'text',
        text: `${baseUrl}/profile?userId=${userId}`
      })
      console.log(profile)
      return {
        type: 'text',
        text: `Name: ${profile.displayName} \nUserID: ${userId} \nStatus: 
        ${profile.statusMessage} \nAvatar: ${profile.pictureUrl}`
      }
    case INTEND_GET_LOCATION:
      return {
        type: 'location',
        title: '小鯨魚的房間',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203
      }
    case INTEND_GET_POSTBACK:
      return {
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: [
            {
              thumbnailImageUrl: 'https://i.imgur.com/uzSuzZm.jpg',
              imageBackgroundColor: '#FFFFFF',
              title: '小鯨魚的辦公室',
              text: '歡迎光臨，小鯨魚的辦公室唷',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'https://mydeepq.deepq.com'
              },
              actions: [
                {
                  type: 'postback',
                  label: 'Buy',
                  data: 'action=buy&itemid=111'
                },
                {
                  type: 'postback',
                  label: 'Add to cart',
                  data: 'action=add&itemid=111'
                },
                {
                  type: 'uri',
                  label: 'Enter to MyDeepQ',
                  uri: `https://mydeepq.deepq.com?userid=${e.source.userId}`
                }
              ]
            },
            {
              thumbnailImageUrl: 'https://i.imgur.com/jlIMeCy.jpg',
              imageBackgroundColor: '#eeeeee',
              title: '小鯨魚的食物',
              text: '休憩室的日常',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222'
              },
              actions: [
                {
                  type: 'postback',
                  label: 'Buy',
                  data: 'action=buy&itemid=222'
                },
                {
                  type: 'postback',
                  label: 'Add to cart',
                  data: 'action=add&itemid=222'
                },
                {
                  type: 'uri',
                  label: 'View detail',
                  uri: 'http://example.com/page/222'
                }
              ]
            }
          ],
          imageAspectRatio: 'rectangle',
          imageSize: 'cover'
        }
      }
    case INTEND_GET_IMAGE_MAP:
      return new ImageMap(imagemapConfig, baseUrl, [
        {
          type: 'message',
          label: 'hello',
          text: 'hello1'
        },
        {
          type: 'message',
          label: 'hello',
          text: 'hello2'
        },
        {
          type: 'message',
          label: 'hello',
          text: 'hello3'
        },
        {
          type: 'uri',
          label: 'link to profile',
          linkUri: `${baseUrl}/profile?userId=${userId}`
        }
      ])
    case INTEND_GET_INSTANT_APP_LINK:
      return {
        type: 'text',
        text: `${baseUrl}/demo/instantapp?userId=${userId}`
      }
    case INTEND_GET_DYNAMIC_LINK:
      return {
        type: 'text',
        text: `${baseUrl}/demo/dynamiclink?userId=${userId}`
      }
    case INTEND_GET_BUTTON_TEMPLATE:
      return {
        type: 'template',
        altText: 'This is a buttons template',
        template: {
          type: 'buttons',
          title: 'Button Template Demo',
          text: 'Please select',
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123'
          },
          actions: [
            {
              type: 'uri',
              label: 'LINE browser',
              uri: `${baseUrl}/profile?userId=${userId}`
            },
            {
              type: 'uri',
              label: 'Chrome browser',
              uri: `${baseUrl}/demo/chrome?userId=${userId}`
            },
            {
              type: 'uri',
              label: 'Dynamic link',
              uri: `${baseUrl}/demo/dynamiclink?userId=${userId}`
            },
            {
              type: 'uri',
              label: 'Instant App link',
              uri: `${baseUrl}/demo/instantapp?userId=${userId}`
            }
          ]
        }
      }
    default:
      return { type: 'text', text: `小鯨魚的回話：${e.message.text}` }
  }
}
