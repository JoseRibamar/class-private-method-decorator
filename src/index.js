const _privates = []

export function classWithPrivateMethods(target) {
  const proto = target.prototype
  const methodNames = Object.getOwnPropertyNames(proto)
  for (let k in proto) methodNames.push(k)
  const privatesForTarget = new Set(_privates.filter(e => e.target === target).map(e => e.name))

  function Klass(...args) {
    const instance = new target(...args)
    const newProto = {}
    const methodMap = {}

    for (let methodName of methodNames) {
      const isPrivate = privatesForTarget.has(methodName)
      if (isPrivate) continue

      const fn = proto[methodName]

      newProto[methodName] = {
        configurable: true,
        get() { return methodMap[methodName] || (methodMap[methodName] = fn.bind(instance)) },
        set(newFn) { methodMap[methodName] = newFn.bind(instance); instance[methodName] = newFn }
      }

      newProto.__origInstance = { value: instance }
    }

    Object.defineProperties(this, newProto)
  }

  return Klass
}

export function privateMethod(target, name) {
  _privates.push({ target: target.constructor, name })
}
