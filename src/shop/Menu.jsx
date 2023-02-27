import { useList, useUnit } from 'effector-react'
import Item from './Item'
import { $items, $pending, addToCart, removeFromCart } from './useShop'

export default function Menu() {
  const pending = useUnit($pending)

  const list = useList($items, (item) => {
    return (
      <Item
        {...item}
        add={() => addToCart(item.id)}
        remove={() => removeFromCart(item.id)}
      />
    )
  })

  return (
    <div style={{ display: 'flex', flexFlow: 'column', padding: '6px 12px' }}>
      <h2>Menu</h2>
      {!pending ? list : 'Loading items ...'}
    </div>
  )
}
