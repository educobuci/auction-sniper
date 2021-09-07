import { SniperListener } from './auction-sniper/ports'
import { AuctionStatus } from './auction-status'

export default class SniperStateDisplayer implements SniperListener {
  ui: SniperUI

  constructor(ui: SniperUI) {
    this.ui = ui
  }

  sniperLost(): void {
    this.ui.showStatus(AuctionStatus.Lost)
  }

  sniperBidding(): void {
    this.ui.showStatus(AuctionStatus.Bidding)
  }
}

export interface SniperUI {
  showStatus(status: AuctionStatus): void
}