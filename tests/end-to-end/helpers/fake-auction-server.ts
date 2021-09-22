import Pusher, { Channel } from 'pusher-js'
import config from './config'

const PUSHER_KEY = 'e42e4c2ccfd7b0128b0c'
const PUSHER_CLUSTER = 'mt1'
const PUSHER_AUTH_ENDPOINT = `${config.host}/api/pusher/auth`
const PUSHER_SUBSCRIPTION_SUCCEEDED = 'pusher:subscription_succeeded'

const EVENT_TIMEOUT = 3000

export default class FakeAuctionServer {
  private itemId: string
  private pusher: Pusher
  private channel: Channel

  constructor(itemId: string) {
    this.itemId = itemId
    Pusher.logToConsole = false
    this.pusher = new Pusher(PUSHER_KEY, {
      authEndpoint: PUSHER_AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER
    })
  }

  async startSellingItem() {
    const channelName = `private-${this.itemId}`
    this.channel = this.pusher.subscribe(channelName)
    await new Promise<Boolean>(resolve => this.channel.bind(PUSHER_SUBSCRIPTION_SUCCEEDED, resolve))
  }

  async hasReceivedJoinRequestFromSniper() {
    const join = await this.waitForEvent('client-join')
    expect(join).not.toBeNull()
  }

  announceClosed() {
    this.channel.trigger('client-close', { })
  }

  getItemId() {
    return this.itemId
  }

  reportPrice(currentPrice: number, increment: number, bidder: string) {
    this.channel.trigger('client-price', { currentPrice, increment, bidder })
  }

  async hasReceivedBid(amount: number) {
    expect(await this.waitForEvent('client-bid')).toEqual({ amount })
  }

  stop() {
    this.channel?.unsubscribe()
    this.channel?.unbind_all()
    this.channel?.disconnect()
    this.pusher.disconnect()
  }

  private async waitForEvent(name: string): Promise<any> {
    const value = await new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.channel.unbind(name)
        reject(`Timeout: '${name}' event has not been received for auction ${this.itemId}`)
      }, EVENT_TIMEOUT)
      this.channel.bind(name, (data: any) => {
        this.channel.unbind(name)
        clearTimeout(timeout)
        resolve(data)
      })
    })
    return value
  }
}