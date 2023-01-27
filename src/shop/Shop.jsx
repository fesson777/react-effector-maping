import { useStore } from 'effector-react'
import { useEffect } from 'react'
import Cart from './Cart'
import Menu from './Menu'
import useShop from './useShop'

export default function Shop() {
  const { store } = useShop()
  const cart = useStore(store.$cart)
  console.log('🚀 ~ file: Shop.jsx:8 ~ Shop ~ $cart', cart)
  const { events } = useShop()

  useEffect(() => {
    events.shopOpened() // eslint-disable-next-line
  }, [])

  return (
    <>
      <div style={{ display: 'flex', fontSize: 14 }}>
        <Menu />
        <Cart />
      </div>
    </>
  )
}
