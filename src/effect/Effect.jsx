import { createEffect, createStore } from 'effector'
import { useEvent, useStore } from 'effector-react'
import useEffectorCounter from '../counter/useCounter'

// const userUpdated = createEvent()
// // const userNameUpdated = userUpdated.map(({ name }) => name) // you may decompose dataflow with .map() method
// // const userRoleUpdated = userUpdated.map(({ role }) => role.toUpperCase()) // either way you can transform data

// userUpdated.watch(({ name }) => console.log(`User's name is [${name}] now`))
// userUpdated.watch(({ role }) =>
//   console.log(`User's role is [${role.toUpperCase()}] now`)
// )

// userUpdated({ name: 'john', role: 'admin' })

const url = 'https://jsonplaceholder.typicode.com/'

const fetchDataFx = createEffect((url) => fetch(url).then((res) => res.json()))

const $data = createStore(null).on(fetchDataFx.doneData, (state, res) => res)

export default function Effect() {
  const { combinedCountStore } = useEffectorCounter()

  const data = useStore($data)
  const pending = useStore(fetchDataFx.pending)
  const fetchDataEvent = useEvent(fetchDataFx)

  function handleLoadData(path) {
    fetchDataEvent(url + path)
  }

  return (
    <section className="effect">
      <div>State from count store: "count": {combinedCountStore.counter}</div>
      <div>
        State from count store: "count async": {combinedCountStore.asyncStore}
      </div>
      <button disabled={pending} onClick={() => handleLoadData('users')}>
        load users
      </button>
      <button disabled={pending} onClick={() => handleLoadData('posts')}>
        load todos
      </button>
      <div>
        {data
          ? data.slice(0, 6).map((u, i) => (
              <div key={u.id}>
                {i + 1}. {u?.name || u?.title}
              </div>
            ))
          : 'push to load'}
      </div>
    </section>
  )
}
