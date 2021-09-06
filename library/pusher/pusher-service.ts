import Pusher, { Channel } from 'pusher-js'
import { config } from 'library/config'
import AuctionEventTranslator from 'library/auction-event-translator'

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
const SUBSCRIBED = 'pusher:subscription_succeeded'
const AUTH_ENDPOINT = '/api/pusher/auth'

let channel: Channel

export const subscribeToChannel = async (channelName: string, translator: AuctionEventTranslator) => {
  Pusher.logToConsole = false
  const pusher = new Pusher(pusherApiKey, {
    authEndpoint: AUTH_ENDPOINT,
    cluster: config.cluster
  })
  channel = pusher.subscribe(channelName)
  return new Promise<Channel>(res => {
    channel.bind_global((name: string, data: any) => {
      if(name === SUBSCRIBED) {
        res(channel)
      }
      if(name.startsWith('client-')) {
        translator.processEvent(name, data)
      }
    })
  })
}

export const on = (event: string, handler: (data: any) => void) => {
  channel.bind(`client-${event}`, handler)
}

export const dispatch = (event: string, data: any) => {
  channel.trigger(`client-${event}`, data)
}
