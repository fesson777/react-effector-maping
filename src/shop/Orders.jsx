import { useList, useUnit } from 'effector-react'
import { $orders, $totalOrders } from './useShop'

export default function Orders() {
  const total = useUnit($totalOrders)
  const list = useList($orders, (order) => {
    const values = Object.values(order)

    const result = values.map((order, index) => (
      <div key={index}>
        {index + 1}. {order.name} *{order.price} руб. {order.count}шт. =
        {order.count * order.price}
      </div>
    ))

    return <div style={{ padding: 2, border: '1px solid grey' }}>{result}</div>
  })

  return (
    <div className="orders">
      <section>{list}</section>
      <span>Всего: {total} руб.</span>
    </div>
  )
}
