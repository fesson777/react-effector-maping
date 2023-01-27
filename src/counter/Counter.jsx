import useEffectorCounter from './useCounter'

export default function Counter() {
  const { combinedCountStore, getValueFx, pending, reducers } =
    useEffectorCounter()

  return (
    <section>
      <p>Count: {combinedCountStore.counter}</p>
      <button disabled={pending} onClick={reducers.increment}>
        +1
      </button>
      <button disabled={pending} onClick={reducers.decrement}>
        -1
      </button>
      <button disabled={pending} onClick={reducers.resetCounter}>
        reset
      </button>
      <button
        disabled={pending}
        onClick={() => getValueFx(combinedCountStore.counter)}
      >
        async
      </button>
      <br />
      <div>counterText: {combinedCountStore.counterText}</div>
      <div>
        counterCombined: {combinedCountStore.counter},
        {combinedCountStore.counterText}
      </div>
      <div className={pending ? 'fade' : 'normal'}>
        Async combine: {combinedCountStore.asyncStore}
      </div>
    </section>
  )
}
