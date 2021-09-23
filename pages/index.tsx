import  Head from 'next/head'
import SniperTable from 'components/SniperTable'
import { useAuctionSniper } from 'hooks/useAuctionSniper'


export default function Home({ items, sniperId }: { items: string[], sniperId: string }) {
  const { table } = useAuctionSniper(items, sniperId)
  return <div className="h-screen dark:bg-gray-800 dark:text-white p-4">
    <Head>
      <title>Auction Sniper</title>
    </Head>
    <h1 className="text-3xl">Auction Sniper</h1>
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