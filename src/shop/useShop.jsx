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

//menu scope
export const addToCart = createEvent()
export const removeFromCart = createEvent()

export const getItemsFx = createEffect(async () => {
  await new Promise((r) => setTimeout(r, 1000))
  return import('./data.json').then((module) => module.default)
})

export const $items = restore(getItemsFx.doneData, [])

//shop scope , start app
export const shopOpened = createEvent()

forward({
  from: shopOpened,
  to: getItemsFx,
})

// cart scope
export const makeOrderFx = createEffect(async (order) => {
  await new Promise((r) => setTimeout(r, 1000))

  console.log('ORDER', order)
  const list = Object.values(order)

  if (list.find((item) => item.id === 4)) {
    return Promise.reject({ id: 4 })
  }

  return order
})

export const addItemToCart = sample({
  source: $items,
  clock: addToCart,
  fn: (items, id) => items.find((item) => item.id === id),
})

export const $cart = createStore({})
  .on(addItemToCart, (cart, item) => {
    return {
      ...cart,
      [item.id]: {
        ...item,
        count:
          typeof cart[item.id]?.count === 'undefined'
            ? 1
            : cart[item.id].count + 1,
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

export const $minTotal = createStore(150)

export const makeOrder = createEvent()

// delete from cart
forward({
  from: makeOrderFx.failData,
  to: removeFromCart.prepend(({ id }) => id),
})

//errors cart
export const $orderError = createStore('')
  .on(
    makeOrderFx.failData,
    (_, { id }) =>
      "Sorry, we're out of Soup. \n You can pick anything else without any conditions"
  )
  .on(makeOrderFx.done, () => '')

// ============================================================== store $total > for combine store ($canOrder) for guard makeOrderFx && view in Cart
export const $total = $cart.map((cart) =>
  Object.values(cart).reduce((total, item) => {
    return total + item.price * item.count
  }, 0)
)
// ============================================================== store $cartList > view in Cart (chosen items)
export const $cartList = $cart.map((cart) => Object.values(cart))

// ============================================================== store $canOrder (combine) > guard makeOrderFx > filter
export const $canOrder = combine(
  $total,
  $minTotal,
  $orderError,
  (total, min, error) => (error.length > 0 ? true : total >= min)
)

// ============================================================== store $cart - guard makeOrderFx > data for makeOrderFx
guard({
  source: $cart,
  clock: makeOrder,
  filter: $canOrder,
  target: makeOrderFx,
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

export const resetOrder = createEvent()

export const $orders = createStore([])
  .on(makeOrderFx.doneData, (state, data) => {
    return [...state, data]
  })
  .reset(resetOrder)

export const $totalOrders = $orders.map((order) => {
  let result = 0
  order.forEach((ord) => {
    Object.values(ord).forEach((item) => {
      result += item.price * item.count
    })
  })

  return result
})
export const $pending = restore(getItemsFx.pending, false)
export const $pendingCart = restore(makeOrderFx.pending, false)
