import { useCallback, useEffect, useState } from 'react'
import { PusherAuction, AuctionEventTranslator, setEventTranslator, subscribeToChannel } from 'library/pusher'
import { AuctionSniper, SniperState } from 'library/core'
import SniperStateDisplayer, { SniperUI } from 'library/presentation/sniper-state-displayer'
import SniperTable, { SniperTableProps } from 'components/SniperTable'

export default function Home({ itemId, sniperId }: { itemId: string, sniperId: string }) {
  const initalState = { id: itemId, lastPrice: '0', lastBid: '0', state: SniperState.Joining }
  const [tableModel, setTableModel] = useState<SniperTableProps>({ rows: [{ ...initalState }] })

  const joinAuction = useCallback(async () => {
    const channel = await subscribeToChannel(`private-${itemId}`)
    const auction = new PusherAuction(channel)
    const ui: SniperUI = {
      showStatusChanged: ({ lastPrice, lastBid, state }) =>
        setTableModel({ rows: [{ id: itemId, lastPrice: `${lastPrice}`, lastBid: `${lastBid}`, state }] })
    }
    const displayer = new SniperStateDisplayer(ui)
    const sniper = new AuctionSniper(itemId, auction, displayer)
    setEventTranslator(new AuctionEventTranslator(sniperId, sniper))
    auction.join()
  }, [itemId, sniperId])

  useEffect(() => { joinAuction() }, [ joinAuction ])

  return <div className="h-screen dark:bg-gray-800 dark:text-white p-4">
    <h1 className="text-3xl">Auction Sniper: { itemId }</h1>
    <div>
      <SniperTable rows={ tableModel.rows } />
    </div>
  </div>
}

export function getServerSideProps({ query }) {
  return {
    props: {
      itemId: query['item-id'],
      sniperId: query['sniper-id']
    }
  }
}