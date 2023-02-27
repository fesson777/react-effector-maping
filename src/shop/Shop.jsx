import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import Cart from './Cart'
import Menu from './Menu'
import Orders from './Orders'
import { shopOpened } from './useShop'

export default function Shop() {
  const openShop = useUnit(shopOpened)

  useEffect(() => {
    openShop() // eslint-disable-next-line
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', fontSize: 14, minHeight: 240 }}>
        <Menu />
        <Cart />
      </div>
      <div>
        <Orders />
      </div>
    </div>
  )
}
