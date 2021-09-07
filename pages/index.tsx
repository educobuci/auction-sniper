import { AuctionStatus } from 'library/auction-status'
import { useCallback, useEffect, useState } from 'react'
import { subscribeToChannel } from 'library/pusher/pusher-service'
import AuctionEventTranslator from 'library/auction-event-translator'
import AuctionSniper from 'library/auction-sniper/auction-sniper'
import { SniperListener } from 'library/auction-sniper/ports'
import { Auction } from 'library/auction/ports'

export default function Home({ itemId }: { itemId: string }) {
  const [status, setStatus] = useState(AuctionStatus.Joining)

  const connect = useCallback(async () => {
    const sniperListener: SniperListener = {
      sniperLost: () => setStatus(AuctionStatus.Lost),
      sniperBidding: () => setStatus(AuctionStatus.Bidding),
    }
    const auction: Auction = {
      bid(amount: number) {

      }
    }
    const sniper = new AuctionSniper(auction, sniperListener)
    const translator = new AuctionEventTranslator(sniper)
    const channel = await subscribeToChannel(`private-${itemId}`, translator)
    channel.trigger('client-join', {})
  }, [itemId])

  useEffect(() => { connect() }, [ connect ])

  return <div className="h-screen dark:bg-gray-900 dark:text-white p-4">
    <h1 className="text-3xl">Auction Sniper: { itemId }</h1>
    <div id="status-label">{ status }</div>
  </div>
}

export function getServerSideProps({ query }) {
  return {
    props: { itemId: query['item-id'] }
  }
}