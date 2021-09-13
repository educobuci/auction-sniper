import { SniperState } from '.'

export class SniperSnapshot {
  itemId: string
  lastPrice: number
  lastBid: number
  state: SniperState

  constructor(itemId: string, lastPrice: number, lastBid: number, state: SniperState){
    this.itemId = itemId
    this.lastPrice = lastPrice
    this.lastBid = lastBid
    this.state = state
  }

  bidding(lastPrice: number, lastBid: number) {
    return new SniperSnapshot(this.itemId, lastPrice, lastBid, SniperState.Bidding)
  }

  winning(lastPrice: number) {
    return new SniperSnapshot(this.itemId, lastPrice, this.lastBid, SniperState.Winning)
  }

  lost() {
    return new SniperSnapshot(this.itemId, this.lastPrice, this.lastBid, SniperState.Lost)
  }

  won() {
    return new SniperSnapshot(this.itemId, this.lastPrice, this.lastBid, SniperState.Won)
  }

  static joining(itemId: string): SniperSnapshot {
    return new SniperSnapshot(itemId, 0, 0, SniperState.Joining)
  }
}