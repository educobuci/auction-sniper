import { useCallback, useEffect, useReducer, useState } from 'react'
import  Head from 'next/head'
import { PusherAuction, AuctionEventTranslator, subscribeToChannel } from 'library/pusher'
import { AuctionSniper, SniperListener, SniperSnapshot, SniperState } from 'library/core'
import SniperTable, { SniperTableProps, SniperTableRow } from 'components/SniperTable'

const reducer = (state: SniperTableProps, action: { type: string, snapshot: SniperSnapshot}) => {
  switch(action.type) {
    case 'update':
      const { itemId, lastPrice, lastBid, state: itemState } = action.snapshot
      const index = state.rows.findIndex(i => i.id === itemId)
      const row: SniperTableRow = { id: itemId, lastPrice: `${lastPrice}`, lastBid: `${lastBid}`, state: itemState }
      let rows = [...state.rows]
      rows.splice(index, 1, row)
      return { rows }
  }
}

export default function Home({ items, sniperId }: { items: string[], sniperId: string }) {
  const initialState = { rows: items.map(id => ({ id: id, lastPrice: '0', lastBid: '0', state: SniperState.Joining }))}
  const [tableState, dispatch] = useReducer(reducer, initialState)

  const joinAuction = useCallback(async () => {
    const sniperListener: SniperListener = {
      sniperStateChanged: (snapshot) => { dispatch({ type: 'update', snapshot: snapshot }) }
    }
    for(const item of items) {
      const channel = await subscribeToChannel(`private-${item}`)
      const auction = new PusherAuction(channel)
      const sniper = new AuctionSniper(item, auction, sniperListener)
      channel['translator'] = new AuctionEventTranslator(sniperId, sniper)
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
      <SniperTable rows={ tableState.rows } />
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