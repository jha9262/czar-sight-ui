import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/product-models/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/product-models/"!</div>
}
