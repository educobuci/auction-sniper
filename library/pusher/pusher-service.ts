import Pusher, { Channel } from 'pusher-js'
import { config } from 'library/config'

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
const SUBSCRIBED = 'pusher:subscription_succeeded'
const AUTH_ENDPOINT = '/api/pusher/auth'

let channel: Channel

export const subscribe = async (itemId: string) => {
  const channelName = `private-${itemId}`
  const pusher = new Pusher(pusherApiKey, {
    authEndpoint: AUTH_ENDPOINT,
    cluster: config.cluster
  })
  channel = pusher.subscribe(channelName)
  return new Promise<void>(res => channel.bind(SUBSCRIBED, res))
}

export const on = (event: string, handler: (data: any) => void) => {
  channel.bind(`client-${event}`, handler)
}

export const dispatch = (event: string, data: any) => {
  channel.trigger(`client-${event}`, data)
}
