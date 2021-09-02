import Pusher, { Channel } from 'pusher-js'

const PUSHER_KEY = 'e42e4c2ccfd7b0128b0c'
const PUSHER_EVENT = 'client-message'
const PUSHER_CLUSTER = 'mt1'
const PUSHER_AUTH_ENDPOINT = 'http://localhost:9000/api/pusher/auth'
const PUSHER_SUBSCRIPTION_SUCCEEDED = 'pusher:subscription_succeeded'

export default class FakeAuctionServer {
  itemId: string
  pusher: Pusher
  channel: Channel
  messages: Array<any>

  constructor(itemId: string) {
    this.itemId = itemId
    this.messages = []
    Pusher.logToConsole = true
    this.pusher = new Pusher(PUSHER_KEY, {
      authEndpoint: PUSHER_AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER
    })
  }

  startSellingItem() {
    const channelName = `private-${this.itemId}`
    this.channel = this.pusher.subscribe(channelName)
  }

  async hasReceivedJoinRequestFromSniper() {
    const subscribe = new Promise<void>((resolve) => {
      this.channel.bind(PUSHER_SUBSCRIPTION_SUCCEEDED, resolve)
    })
    const messageListner = new Promise<void>((resolve) => {
      this.channel.bind(PUSHER_EVENT, (data: any) => {
        this.messages.push(data)
        resolve(data)
      })
    })
    await subscribe
    return expect(messageListner).resolves.not.toThrow()
  }

  async announceClosed() {
    this.channel.trigger(PUSHER_EVENT, {})
  }

  getItemId() {
    return this.itemId
  }

  stop() {
    this.channel?.unbind_all()
    this.channel?.disconnect()
    this.pusher.disconnect()
  }
}