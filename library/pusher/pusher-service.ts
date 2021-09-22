import Pusher, { Channel } from 'pusher-js'
import { config } from '../../config'
import { AuctionEventTranslator } from './auction-event-translator'

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
const SUBSCRIBED = 'pusher:subscription_succeeded'
const AUTH_ENDPOINT = '/api/pusher/auth'

Pusher.logToConsole = false

const pusher = new Pusher(pusherApiKey, {
  authEndpoint: AUTH_ENDPOINT,
  cluster: config.cluster
})


export const subscribeToChannel = (channelName: string) => {
  const channel = pusher.subscribe(channelName)
  return new Promise<Channel>(res => {
    channel.bind_global((name: string, data: any) => {
      if(name === SUBSCRIBED) {
        res(channel)
      }
      if(name.startsWith('client-')) {
        (channel['translator'] as AuctionEventTranslator)?.processEvent(name, data)
      }
    })
  })
}
