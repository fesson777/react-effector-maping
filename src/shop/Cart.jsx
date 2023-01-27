import { useList, useStore } from 'effector-react'
import Item from './Item'
import useShop from './useShop'

export default function Cart() {
  const { store, events, pending } = useShop()

  const error = useStore(store.$orderError)
  const canOrder = useStore(store.$canOrder)
  const total = useStore(store.$total)

  const list = useList(store.$cartList, (item) => {
    return (
      <Item
        {...item}
        add={() => events.addToCart(item.id)}
        remove={() => events.removeFromCart(item.id)}
      />
    )
  })

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        padding: '6px 12px',
        border: '1px solid red',
        marginLeft: 16,
        width: 205,
      }}
    >
      <h2>Cart</h2>
      {!pending.pendingMakeOrder ? list : 'Your order in loading...'}
      <div>Total: $ {total}</div>
      <button disabled={!canOrder} onClick={events.makeOrder}>
        Make order
      </button>
      <div>{error}</div>
    </div>
  )
}
