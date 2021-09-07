import Pusher, { Channel } from 'pusher-js'
import { config } from 'library/config'
import AuctionEventTranslator from 'library/auction-event-translator'

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
const SUBSCRIBED = 'pusher:subscription_succeeded'
const AUTH_ENDPOINT = '/api/pusher/auth'

let translator: AuctionEventTranslator = null

export const setEventTranslator = async (eventTranslator: AuctionEventTranslator) => {
  translator = eventTranslator
}

export const subscribeToChannel = (channelName: string, ) => {
  Pusher.logToConsole = false
  const pusher = new Pusher(pusherApiKey, {
    authEndpoint: AUTH_ENDPOINT,
    cluster: config.cluster
  })
  const channel = pusher.subscribe(channelName)
  return new Promise<Channel>(res => {
    channel.bind_global((name: string, data: any) => {
      if(name === SUBSCRIBED) {
        res(channel)
      }
      if(name.startsWith('client-')) {
        translator?.processEvent(name, data)
      }
    })
  })
}
