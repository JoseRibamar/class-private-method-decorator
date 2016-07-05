const _privates = []

const BASE_OBJECT_PROTOTYPE = Object.prototype

export function classWithPrivateMethods(target) {
  class ClassWrapper {
    constructor(...args) {
      const instance = new target(...args)

      Object.defineProperties(this, {
        __origInstance: { value: instance },
        __classWithPrivateMethodsMethodMap: { value: {} }
      })
    }
  }

  hoistPublicMethods(ClassWrapper, target)
  hoistStaticMethods(ClassWrapper, target)

  Object.defineProperties(ClassWrapper, {
    name: { value: `ClassWithPrivateMethodsWrapper(${target.name})` },
    __origClass: { value: target, enumerable: false, configurable: true },
    __origInstance: { value: target, enumerable: false, configurable: true },
    __classWithPrivateMethodsMethodMap: { value: {} }
  })

  return ClassWrapper
}

function hoistPublicMethods(ClassWrapper, target) {
  const proto = target.prototype
  let methodNames = Object.getOwnPropertyNames(proto)

  // add all methods from base class, if any
  const baseClassPrototype = Object.getPrototypeOf(proto)
  if (baseClassPrototype !== BASE_OBJECT_PROTOTYPE) {
    methodNames = methodNames.concat(Object.getOwnPropertyNames(baseClassPrototype))
  }

  methodNames = methodNames.filter(m => m !== 'constructor')

  const privatesForTarget = new Set(_privates.filter(e => e.target === target).map(e => e.name))

  methodNames
    .filter(methodName => !privatesForTarget.has(methodName))
    .forEach(methodName => addBoundMethod(ClassWrapper.prototype, methodName, proto))
}

const NATIVE_STATICS = 'length,name,prototype,__proto__,arguments,caller'.split(',')

function hoistStaticMethods(ClassWrapper, target) {
  const statics = Object.getOwnPropertyNames(target).filter(k => NATIVE_STATICS.indexOf(k) === -1)

  // static methods - bind methods to original class
  statics
    .filter(k => typeof target[k] === 'function')
    .forEach(methodName => addBoundMethod(ClassWrapper, methodName, target))

  // static properties - create accessors
  statics
    .filter(k => typeof target[k] !== 'function')
    .forEach(k => Object.defineProperty(ClassWrapper, k, {
      get() { return target[k] },
      set(v) { return target[k] = v }
    }))
}

// adds a property to *target* with:
// - a memoized getter that returns a bound method to the current instance
// - a setter that sets both wrapper and instance's method
function addBoundMethod(target, methodName, methodsContainer) {
  Object.defineProperty(
    target,
    methodName,
    {
      configurable: true,
      get() {
        // direct read from Class.prototype.method needs to return the method itself
        if (!this.__classWithPrivateMethodsMethodMap) return methodsContainer[methodName]
        // reads from an instance need to return a bound method to the instance
        return this.__classWithPrivateMethodsMethodMap[methodName] || (this.__classWithPrivateMethodsMethodMap[methodName] = methodsContainer[methodName].bind(this.__origInstance))
      },
      set(newFn) {
        if (!this.__classWithPrivateMethodsMethodMap) return methodsContainer[methodName] = newFn
        this.__classWithPrivateMethodsMethodMap[methodName] = newFn.bind(this.__origInstance)
        this.__origInstance[methodName] = newFn
      }
    }
  )
}

export function extendClassWithPrivateMethods(target, obj) {
  obj = Object.assign({}, obj)
  Object.assign(target.__origClass.prototype, obj)

  const objProperties = Object.getOwnPropertyNames(obj)

  objProperties
    .filter(k => typeof obj[k] === 'function')
    .forEach(k => addBoundMethod(target.prototype, k, obj))

  objProperties
    .filter(k => typeof obj[k] !== 'function')
    .forEach(k => target.prototype[k] = obj[k])
}

export function privateMethod(target, name) {
  _privates.push({ target: target.constructor, name })
}
