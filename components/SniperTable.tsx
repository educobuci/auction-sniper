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

const TableCell = ({ children }) =>
  <td className="border border-gray-300 dark:border-gray-500 px-2 py-1">{children}</td>

const TableHeadCell = ({ children }) =>
  <th className="border border-gray-300 dark:border-gray-500 px-2 py-1">{children}</th>

const SniperTable: FC<SniperTableProps> = ({ rows }) =>
  <table>
    <thead>
      <tr>
        <TableHeadCell>Item</TableHeadCell>
        <TableHeadCell>Last Price</TableHeadCell>
        <TableHeadCell>Last Bid</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
      </tr>
    </thead>
    <tbody>
      { rows.map(({ id, lastPrice, lastBid, status }) => 
        <tr key={id}>
          <TableCell>{id}</TableCell>
          <TableCell>{lastPrice}</TableCell>
          <TableCell>{lastBid}</TableCell>
          <TableCell>{status}</TableCell>
        </tr>
      )}
    </tbody>
  </table>
  
  
export default SniperTable