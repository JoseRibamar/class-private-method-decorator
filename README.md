# class-private-method-decorator

> Private methods in a JavaScript ES6 class using an ES7 decorator

[![build status](https://img.shields.io/travis/elado/class-private-method-decorator/master.svg?style=flat-square)](https://travis-ci.org/elado/class-private-method-decorator) [![npm version](https://img.shields.io/npm/v/class-private-method-decorator.svg?style=flat-square)](https://www.npmjs.com/package/class-private-method-decorator) [![codeclimate](https://img.shields.io/codeclimate/github/elado/class-private-method-decorator.svg?style=flat-square)](https://codeclimate.com/github/elado/class-private-method-decorator)

This decorator wraps a class with another, exposing only public and static methods and properties. Behind the scenes, it creates properties for public methods on the prototype of the wrapped class. The properties return proxied functions to the original instance.

It supports inheritance and prototype changes even after class definition.

## Installation

```sh
npm install class-private-method-decorator --save
```

Requires `babel` with `babel-plugin-transform-decorators-legacy` plugin.

## Usage

### Basic private methods

```js
import { classWithPrivateMethods, privateMethod } from 'class-private-method-decorator'

@classWithPrivateMethods
class SomeClass {
  publicMethod() {
    return 1
  }

  publicMethodThatUsesAPrivateMethod() {
    return 2 + this.privateMethod()
  }

  @privateMethod
  privateMethod() {
    return 3
  }
}

const something = new SomeClass()
something.publicMethod() // => 1
something.privateMethod() // => TypeError: something.privateMethod is not a function
something.publicMethodThatUsesAPrivateMethod() // => 5
```

### Extending prototype after class definition

Since this library creates a wrapper class, extending its prototype after definition needs an extra step of extending the original class' prototype. `extendClassWithPrivateMethods` takes care of that.

```js
import EventEmitter from 'events'
import { classWithPrivateMethods, privateMethod, extendClassWithPrivateMethods } from 'class-private-method-decorator'

@classWithPrivateMethods
class SomeClass {
  cancel() {
    this.emit('cancel')
  }
}

extendClassWithPrivateMethods(SomeClass, EventEmitter.prototype)

const instance = new SomeClass()

instance.on('cancel', () => {
  console.log('cancelled!')
})

instance.cancel() // cancelled!
```

### `__origInstance`

The original instance with all the methods can be accessed by `__origInstance` property. Useful for debugging.

```js
something.__origInstance.privateMethod() // => 3
```

### `__origClass`

The original class as a property of the wrapper class.

```js
@classWithPrivateMethods
class SomeClass {
}

SomeClass.__origClass // will return the unwrapped SomeClass
```

## Test

```sh
npm install
npm test
```

## License

MIT
