import  Head from 'next/head'
import { useCallback, useEffect, useReducer } from 'react'
import { PusherAuction, AuctionEventTranslator, PusherClient } from 'library/pusher'
import { AuctionSniper, SniperListener, SniperSnapshot } from 'library/core'
import SniperTable, { SniperTableProps } from 'components/SniperTable'

const reducer = (state: SniperSnapshot[], action: { type: string, snapshot: SniperSnapshot}) => {
  switch(action.type) {
    case 'update':
      const index = state.findIndex(i => i.itemId === action.snapshot.itemId)
      let newState = [...state]
      newState.splice(index, 1, action.snapshot)
      return newState
  }
}

export default function Home({ items, sniperId }: { items: string[], sniperId: string }) {
  const initialState = items.map(SniperSnapshot.joining)
  const [state, dispatch] = useReducer(reducer, initialState)

  const table: SniperTableProps = { rows: state.map(({ itemId, lastPrice, lastBid, state }) => {
    return { id: itemId, lastPrice: `${lastPrice}`, lastBid: `${lastBid}`, state }
  })}

  const joinAuction = useCallback(async () => {
    const client = new PusherClient()
    const sniperListener: SniperListener = {
      sniperStateChanged: (snapshot) => { dispatch({ type: 'update', snapshot: snapshot }) }
    }
    for(const item of items) {
      const channel = await client.subscribe(`private-${item}`)
      const auction = new PusherAuction(channel)
      const sniper = new AuctionSniper(item, auction, sniperListener)
      PusherClient.setTranslator(channel, new AuctionEventTranslator(sniperId, sniper))
      auction.join()
    }
  }, [items, sniperId])

  useEffect(() => { joinAuction() }, [ joinAuction ])

  return <div className="h-screen dark:bg-gray-800 dark:text-white p-4">
    <Head>
      <title>Auction Sniper</title>
    </Head>
    <h1 className="text-3xl">Auction Sniper: { items }</h1>
    <div>
      <SniperTable { ...table } />
    </div>
  </div>
}

export function getServerSideProps({ query }) {
  const items = query['items']
  return {
    props: {
      items: Array.isArray(items) ? items : [items],
      sniperId: query['sniper-id']
    }
  }
}