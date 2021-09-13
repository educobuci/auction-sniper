import { SniperSnapshot, SniperListener, SniperState } from '../core'

export default class SniperStateDisplayer implements SniperListener {
  ui: SniperUI

  constructor(ui: SniperUI) {
    this.ui = ui
  }

  sniperStateChanged(snapshot: SniperSnapshot): void {
    this.ui.showStatusChanged(snapshot)
  }
}

export interface SniperUI {
  showStatusChanged(snapshot: SniperSnapshot): void
}