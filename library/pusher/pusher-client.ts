import Pusher, { Channel } from 'pusher-js'
import { config } from '../../config'
import { AuctionEventTranslator } from './auction-event-translator'

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
const SUBSCRIBED = 'pusher:subscription_succeeded'
const AUTH_ENDPOINT = '/api/pusher/auth'

export class PusherClient {
  private static translators: { [key: string]: AuctionEventTranslator } = {}
  private pusher: Pusher

  constructor() {
    this.pusher = new Pusher(pusherApiKey, {
      authEndpoint: AUTH_ENDPOINT,
      cluster: config.cluster
    })
  }

  subscribe(channelName: string): Promise<Channel> {
    const channel = this.pusher.subscribe(channelName)
    return new Promise<Channel>(res => {
      channel.bind_global((name: string, data: any) => {
        if(name === SUBSCRIBED) {
          res(channel)
        }
        if(name.startsWith('client-')) {
          (PusherClient.translators[channel.name])?.processEvent(name, data)
        }
      })
    })
  }

  static setTranslator(channel: Channel, translator: AuctionEventTranslator) {
    this.translators[channel.name] = translator
  }
}