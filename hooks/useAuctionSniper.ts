import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { SniperTableProps } from 'components/SniperTable'
import { AuctionSniper, SniperListener, SniperSnapshot } from 'library/core'
import { auctionSniperReducer } from 'reducers/auction-sniper-reducer'
import { AuctionEventTranslator, PusherAuction, PusherClient } from 'library/pusher'

const useAuctionSniper = (items: string[], sniperId: string) => {
  const initialState = items.map(SniperSnapshot.joining)
  const [state, dispatch] = useReducer(auctionSniperReducer, initialState)

  const table: SniperTableProps = useMemo(() => ({ rows: state.map(({ itemId, lastPrice, lastBid, state }) => {
    return { id: itemId, lastPrice: `${lastPrice}`, lastBid: `${lastBid}`, state }
  })}), [state])

  const joinAuction = useCallback(async () => {
    const client = new PusherClient()
    const sniperListener: SniperListener = {
      sniperStateChanged: (snapshot) => { dispatch({ type: 'update', snapshot: snapshot }) }
    }
    for(const item of items) {
      const channel = await client.subscribe(item)
      const auction = new PusherAuction(channel)
      const sniper = new AuctionSniper(item, auction, sniperListener)
      PusherClient.setTranslator(channel, new AuctionEventTranslator(sniperId as string, sniper))
      auction.join()
    }
  }, [items, sniperId])

  useEffect(() => { joinAuction() }, [ joinAuction ])

  return {
    table
  }
}

export { useAuctionSniper }