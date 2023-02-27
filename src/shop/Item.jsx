import { useStoreMap, useUnit } from 'effector-react'
import { $cart, $pending } from './useShop'

export default function Item({ name, price, id, add, remove, disabled }) {
  const pending = useUnit($pending)
  const count = useStoreMap($cart, (cart) => cart[id]?.count ?? 0)
  return (
    <div
      style={{
        padding: 8,
        backgroundColor: 'orange',
        opacity: pending || disabled ? 0.4 : 1,
        marginBottom: 4,
        display: 'flex',
        justifyContent: 'space-between',
        width: 160,
      }}
    >
      {name} - $ {price}
      <div>
        <button
          onClick={remove}
          className="btn-item"
          disabled={pending || disabled}
        >
          -
        </button>
        {count}
        <button
          onClick={add}
          className="btn-item"
          disabled={pending || disabled}
        >
          +
        </button>
      </div>
    </div>
  )
}
