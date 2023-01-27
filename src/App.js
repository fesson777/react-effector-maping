import { useState } from 'react'
import Counter from './counter/Counter'

import './App.css'
import Effect from './effect/Effect'
import Form from './form/Form'
import useEffectorCounter from './counter/useCounter'
import Shop from './shop/Shop'

function App() {
  const [page, setPage] = useState(<Counter />)
  const {
    combinedCountStore: { counter },
  } = useEffectorCounter()

  return (
    <div className="App">
      <h1>Effector</h1>
      <nav>
        <button
          className="variant counter"
          onClick={() => setPage(<Counter />)}
        >
          Counter {counter}
        </button>
        <button className="variant" onClick={() => setPage(<Effect />)}>
          Effect
        </button>
        <button className="variant" onClick={() => setPage(<Form />)}>
          Form
        </button>
        <button className="variant advanced" onClick={() => setPage(<Shop />)}>
          Shop
        </button>
      </nav>

      {page}
    </div>
  )
}

export default App
