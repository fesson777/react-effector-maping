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

// ============================================================== store $cart > sample > addItemToCart > get from $items
const addToCart = createEvent()

// ============================================================== store $cart > .on event> remove item &&
// ============================================================== && forward > if makeOrderFx.failData > removeFromCart.prepend(({ id }) => id)
const removeFromCart = createEvent()

// ============================================================== store $items > effect getItemsFx > get base items
const getItemsFx = createEffect(async () => {
  await new Promise((r) => setTimeout(r, 1000))
  return import('./data.json').then((module) => module.default)
})

// ============================================================== store $Items
const $items = restore(getItemsFx.doneData, [])

// ============================================================== store $cart > sample addItemToCart from event addToCart (args = item.id)
const addItemToCart = sample({
  clock: addToCart,
  source: $items,
  fn: (items, id) => items.find((item) => item.id === id),
})

// ============================================================== store $cart - effect > makeOrderFx - guard with filter (combine > $canOrder)
const makeOrderFx = createEffect(async (order) => {
  await new Promise((r) => setTimeout(r, 1000))

  console.log('ORDER', order)
  const list = Object.values(order)

  if (list.find((item) => item.id === 4)) {
    return Promise.reject({ id: 4 })
  }

  return 'Order is registered!'
})

// ============================================================== store $cart > .on(addItemToCart, removeFromCart).reset(makeOrderFx.doneData)
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

// ============================================================== store $items > event shopOpened to init state
const shopOpened = createEvent()

// ============================================================== store $minTotal > for combine store ($canOrder) for guard makeOrderFx
const $minTotal = createStore(150)

// ============================================================== store $orderError > for combine store ($canOrder) for guard makeOrderFx
const $orderError = createStore('')
  .on(
    makeOrderFx.failData,
    (_, { id }) =>
      "Sorry, we're out of Soup. \n You can pick anything else without any conditions"
  )
  .on(makeOrderFx.done, () => '')

// ============================================================== store $total > for combine store ($canOrder) for guard makeOrderFx && view in Cart
const $total = $cart.map((cart) =>
  Object.values(cart).reduce((total, item) => {
    return total + item.price * item.count
  }, 0)
)

// ============================================================== store $cartList > view in Cart (chosen items)
const $cartList = $cart.map((cart) => Object.values(cart))

// ============================================================== store $cart - event makeOrder > guard makeOrderFx
const makeOrder = createEvent()

// ============================================================== store $canOrder (combine) > guard makeOrderFx > filter
const $canOrder = combine($total, $minTotal, $orderError, (total, min, error) =>
  error.length > 0 ? true : total >= min
)

// ============================================================== store $cart - guard makeOrderFx > data for makeOrderFx
guard({
  source: $cart,
  clock: makeOrder,
  filter: $canOrder,
  target: [makeOrderFx],
})

// ============================================================== store $cart - if makeOrderFx.failData === true > removeFromCart.prepend(({ id }) => id)
forward({
  from: makeOrderFx.failData,
  to: removeFromCart.prepend(({ id }) => id),
})

// ============================================================== store $items > .on(makeOrderFx.failData) > item.disabled = true (item reject in order)
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

// ============================================================== store $items > if event shopOpened > get init state items
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
