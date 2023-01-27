type Cart = {
  id: number
  name: string
  price: number
  count?: number
}

interface Item extends Cart {
  add: (id: number) => void
  remove: (id: number) => void
  disabled?: boolean
}
