import { createEffect, createEvent, createStore, sample } from 'effector'
import { useStore, useStoreMap } from 'effector-react'

const setFields = createEvent()
const submitted = createEvent()
const reset = createEvent()

const sendFormFx = createEffect((params) => {
  console.log(params)
})

const $form = createStore({})
  .on(setFields, (state, { key, value }) => ({
    ...state,
    [key]: value,
  }))
  .on(reset, (_) => null)

const $result = $form.map((data) =>
  Object.keys(data).map((key) => {
    return (
      <div key={key}>
        {key}: {typeof data[key] === 'boolean' ? String(data[key]) : data[key]}
      </div>
    )
  })
)

sample({
  clock: submitted,
  source: $form,
  target: sendFormFx,
})

const handleChange = setFields.prepend((e) => {
  const isCheckbox = e.target.type === 'checkbox'
  const targetValue = isCheckbox ? e.target.checked : e.target.value
  return {
    key: e.target.name,
    value: targetValue,
  }
})

const Field = ({ name, type, label }) => {
  const value = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values) => values[name] || '',
  })
  return (
    <div>
      {label}{' '}
      <input name={name} type={type} value={value} onChange={handleChange} />
    </div>
  )
}
submitted.watch((e) => e.preventDefault())

export default function Form() {
  const result = useStore($result)
  return (
    <div>
      <h2>Form</h2>
      <form onSubmit={submitted}>
        {' '}
        <Field name="login" label="Login" />
        <Field name="password" type="password" label="Password" />
        <Field name="checkbox" type="checkbox" label="Checkbox" />
        <button type="submit">Submit!</button>{' '}
      </form>
      {result}
    </div>
  )
}
