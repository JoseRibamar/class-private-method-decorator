const _privates = []

export default function klass(target) {
  const proto = target.prototype
  const methodNames = Object.getOwnPropertyNames(proto)
  for (let k in proto) methodNames.push(k)
  const privatesForTarget = _privates.filter(e => e.target === target).map(e => e.name).reduce((all, k) => { all[k] = k; return all }, {})

  function Klass(...args) {
    const instance = new target(...args)
    const newProto = {}
    const methodMap = {}

    for (let methodName of methodNames) {
      const isPrivate = methodName in privatesForTarget
      if (isPrivate) continue

      const fn = proto[methodName]

      newProto[methodName] = {
        get() { return methodMap[methodName] || (methodMap[methodName] = fn.bind(instance)) },
        set(newFn) { methodMap[methodName] = newFn.bind(instance); instance[methodName] = newFn }
      }
    }

    Object.defineProperties(this, newProto)
  }

  return Klass
}

klass.private = function (target, name) {
  _privates.push({ target: target.constructor, name })
}
