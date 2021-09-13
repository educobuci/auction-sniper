import { SniperState } from '.'

export type SniperSnapshot = {
  itemId: string
  lastPrice: number
  lastBid: number
  state: SniperState
}