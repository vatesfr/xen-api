import jsonRpc from './json-rpc'
import xmlRpc from './xml-rpc'
import xmlRpcJson from './xml-rpc-json'

export default opts => {
  const factories = [ jsonRpc, xmlRpcJson, xmlRpc ]

  const { length } = factories
  let i = 0

  let call
  function create () {
    const current = factories[i++](opts)
    if (i < length) {
      call = (method, args) => current(method, args).then(
        result => {
          call = current
          return result
        },
        () => {
          create()
          return call(method, args)
        }
      )
    } else {
      call = current
    }
  }
  create()

  return (method, args) => call(method, args)
}
