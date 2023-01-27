import { useList } from 'effector-react'
import Item from './Item'
import useShop from './useShop'

export default function Menu() {
  const { store, events, pending } = useShop()

  const list = useList(store.$items, (item) => {
    return (
      <Item
        {...item}
        add={() => events.addToCart(item.id)}
        remove={() => events.removeFromCart(item.id)}
      />
    )
  })

  return (
    <div style={{ display: 'flex', flexFlow: 'column', padding: '6px 12px' }}>
      <h2>Menu</h2>
      {!pending.pendingItems ? list : 'Loading items ...'}
    </div>
  )
}
