import {
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
  restore,
  sample,
} from 'effector'
import { useStore } from 'effector-react'

const addToCart = createEvent()
const removeFromCart = createEvent()

const getItemsFx = createEffect(async () => {
  await new Promise((r) => setTimeout(r, 1000))
  return import('./data.json').then((module) => module.default)
})

const $items = restore(getItemsFx.doneData, [])

const addItemToCart = sample({
  clock: addToCart,
  source: $items,
  fn: (items, id) => items.find((item) => item.id === id),
})

const makeOrderFx = createEffect(async (order) => {
  await new Promise((r) => setTimeout(r, 1000))

  console.log('ORDER', order)
  const list = Object.values(order)

  if (list.find((item) => item.id === 4)) {
    return Promise.reject({ id: 4 })
  }

  return 'Order is registered!'
})

const $cart = createStore({})
  .on(addItemToCart, (cart, item) => {
    if (cart[item.id]) {
      const cartItem = cart[item.id]

      return {
        ...cart,
        [item.id]: {
          ...cartItem,
          count: cartItem.count + 1,
        },
      }
    }

    return {
      ...cart,
      [item.id]: {
        ...item,
        count: 1,
      },
    }
  })
  .on(removeFromCart, (cart, id) => {
    const cartItem = cart[id]
    if (cartItem && cartItem.count > 1) {
      return {
        ...cart,
        [id]: {
          ...cartItem,
          count: cartItem.count - 1,
        },
      }
    }

    const { [id]: itemToDelete, ...nextCart } = cart

    return nextCart
  })
  .reset(makeOrderFx.doneData)

const shopOpened = createEvent()

const $minTotal = createStore(150)

const $orderError = createStore('')
  .on(
    makeOrderFx.failData,
    (_, { id }) =>
      "Sorry, we're out of Soup. \n You can pick anything else without any conditions"
  )
  .on(makeOrderFx.done, () => '')

const $total = $cart.map((cart) =>
  Object.values(cart).reduce((total, item) => {
    return total + item.price * item.count
  }, 0)
)
const $cartList = $cart.map((cart) => Object.values(cart))

const makeOrder = createEvent()

const $canOrder = combine($total, $minTotal, $orderError, (total, min, error) =>
  error.length > 0 ? true : total >= min
)

guard({
  source: $cart,
  clock: makeOrder,
  filter: $canOrder,
  target: makeOrderFx,
})

forward({
  from: makeOrderFx.failData,
  to: removeFromCart.prepend(({ id }) => id),
})

$items.on(makeOrderFx.failData, (items, { id }) =>
  items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        disabled: true,
      }
    }

    return item
  })
)

forward({
  from: shopOpened,
  to: getItemsFx,
})

export default function useShop() {
  const pendingItems = useStore(getItemsFx.pending)
  const pendingMakeOrder = useStore(makeOrderFx.pending)
  const pendingMakeOrderFx = useStore(makeOrderFx.pending)

  return {
    events: { shopOpened, addToCart, addItemToCart, removeFromCart, makeOrder },
    store: {
      $cart,
      $items,
      $cartList,
      $orderError,
      $canOrder,
      $total,
    },
    effects: {},
    pending: {
      pendingItems,
      pendingMakeOrder,
      pendingMakeOrderFx,
    },
  }
}
