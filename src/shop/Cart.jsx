import { useList, useUnit } from 'effector-react'
import Item from './Item'
import {
  $canOrder,
  $cartList,
  $orderError,
  $pendingCart,
  $total,
  addToCart,
  makeOrder,
  removeFromCart,
} from './useShop'

export default function Cart() {
  const [error, canOrder, total, pending] = useUnit([
    $orderError,
    $canOrder,
    $total,
    $pendingCart,
  ])

  const list = useList($cartList, (item) => {
    return (
      <Item
        {...item}
        add={() => addToCart(item.id)}
        remove={() => removeFromCart(item.id)}
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
      {!pending ? list : 'Your order in loading...'}
      <div>Total: $ {total}</div>
      <button disabled={!canOrder} onClick={makeOrder}>
        Make order
      </button>
      <div>{error}</div>
    </div>
  )
}
