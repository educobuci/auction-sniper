export interface Auction {
  bid(amount: number): void
  join(): void
}