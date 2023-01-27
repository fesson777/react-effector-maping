import { useEffect } from 'react'
import Cart from './Cart'
import Menu from './Menu'
import useShop from './useShop'

export default function Shop() {
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
