export interface SniperListener {
  sniperLost(): void
  sniperBidding(): void
}

export interface AuctionEventListener {
  auctionClosed(): void
  currentPrice(price: number, increment: number): void
}