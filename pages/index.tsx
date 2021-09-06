import { AuctionStatus } from 'library/auction-status'
import { useCallback, useEffect, useState } from 'react'
import { subscribeToChannel } from 'library/pusher/pusher-service'
import AuctionEventTranslator from 'library/auction-event-translator'
import AuctionEventListener from 'library/auction-event-listener'

export default function Home({ itemId }: { itemId: string }) {
  const [status, setStatus] = useState(AuctionStatus.Joining)

  const connect = useCallback(async () => {
    const listener: AuctionEventListener = {
      auctionClosed: () => setStatus(AuctionStatus.Lost),
      currentPrice: () => { }
    }
    const translator = new AuctionEventTranslator(listener)
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