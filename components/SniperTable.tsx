import { FC } from 'react'

export type SniperTableRow = {
  id: string
  lastPrice: string
  lastBid: string
  status: string
}

export type SniperTableProps = {
  rows: SniperTableRow[]
}

const SniperTable: FC<SniperTableProps> = ({ rows }) =>
  <table className="sniper-table" cellSpacing="0">
    <thead>
      <tr>
        <th>Item</th>
        <th>Last Price</th>
        <th>Last Bid</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      { rows.map(({ id, lastPrice, lastBid, status }) => 
        <tr key={id}>
          <td>{id}</td>
          <td>{lastPrice}</td>
          <td>{lastBid}</td>
          <td>{status}</td>
        </tr>
      )}
    </tbody>
  </table>
  
  
export default SniperTable