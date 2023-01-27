import { useEvent, useStore } from 'effector-react'
import { combine, createDomain, createEffect, createStore } from 'effector'

const domain = createDomain()

const $counter = domain.store(0)

const increment = domain.event()
const decrement = domain.event()
const resetCounter = domain.event()

$counter
  .on(increment, (state) => state + 1)
  .on(decrement, (state) => state - 1)
  .reset(resetCounter)

const $counterText = $counter.map((n) => `text + ${n}`)

//===================== ASYNC  ASYNC ASYNC =====================
const $asyncStore = createStore('start')

const asyncWorkFx = createEffect(
  (value) => new Promise((resolve) => setTimeout(() => resolve(value), 1000))
)

$asyncStore.on(asyncWorkFx.doneData, (state, res) => res)

//combine store
const $combinedCountStore = combine({
  counter: $counter,
  counterText: $counterText,
  asyncStore: $asyncStore,
})

export default function useEffectorCounter() {
  const combinedCountStore = useStore($combinedCountStore)
  const reducers = { increment, decrement, resetCounter }
  const pending = useStore(asyncWorkFx.pending)
  const getValueFx = useEvent(asyncWorkFx)
  return {
    combinedCountStore,
    getValueFx,
    pending,
    reducers,
  }
}
