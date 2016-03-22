# class-private-method-decorator

> Private methods in a JavaScript ES6 class using an ES7 decorator

[![build status](https://img.shields.io/travis/elado/class-private-method-decorator/master.svg?style=flat-square)](https://travis-ci.org/elado/class-private-method-decorator) [![npm version](https://img.shields.io/npm/v/class-private-method-decorator.svg?style=flat-square)](https://www.npmjs.com/package/class-private-method-decorator) [![codeclimate](https://img.shields.io/codeclimate/github/elado/class-private-method-decorator.svg?style=flat-square)](https://codeclimate.com/github/elado/class-private-method-decorator)

## Installation

```sh
npm install class-private-method-decorator --save
```

Requires `babel` with `babel-plugin-transform-decorators-legacy` plugin.

## Usage

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

### `__origInstance`

The original instance with all the methods can be accessed by `__origInstance` property. Useful for debugging.

```js
something.__origInstance.privateMethod() // => 3
```

## Test

```sh
npm install
npm test
```

## License

MIT
