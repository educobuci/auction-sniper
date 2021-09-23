import { SniperSnapshot } from 'library/core'

export const auctionSniperReducer = (state: SniperSnapshot[], action: { type: string, snapshot: SniperSnapshot}) => {
  switch(action.type) {
    case 'update':
      const index = state.findIndex(i => i.itemId === action.snapshot.itemId)
      let newState = [...state]
      newState.splice(index, 1, action.snapshot)
      return newState
  }
}