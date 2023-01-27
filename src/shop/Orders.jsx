import { useList, useStore } from 'effector-react'
import useShop from './useShop'

export default function Orders() {
  const { store } = useShop()
  const ord = useStore(store.$order)
  console.log('🚀 ~ file: Orders.jsx:7 ~ Orders ~ ord', ord)
  const list = useList(store.$order, (order, index) => {
    return (
      <div>
        {index + 1}. {order.name} *{order.price} руб. {order.count}шт. =
        {order.count * order.price}
      </div>
    )
  })
  console.log('🚀 ~ file: Orders.jsx:8 ~ list ~ list', list)
  return (
    <div className="orders">
      <section>{list}</section>
      <span>Всего: total руб.</span>
    </div>
  )
}
