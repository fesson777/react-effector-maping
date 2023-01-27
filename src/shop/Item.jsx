import { useStoreMap } from 'effector-react'
import useShop from './useShop'

export default function Item({ name, price, id, add, remove, disabled }) {
  const { store, pending } = useShop()
  const count = useStoreMap(store.$cart, (cart) => cart[id]?.count ?? 0)
  return (
    <div
      style={{
        padding: 8,
        backgroundColor: 'orange',
        opacity: pending.pendingMakeOrderFx || disabled ? 0.4 : 1,
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
          disabled={pending.pendingMakeOrderFx || disabled}
        >
          -
        </button>
        {count}
        <button
          onClick={add}
          className="btn-item"
          disabled={pending.pendingMakeOrderFx || disabled}
        >
          +
        </button>
      </div>
    </div>
  )
}
