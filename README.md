# class-decorators

> Private methods in a JavaScript ES6 class using an ES7 decorator

[![build status](https://img.shields.io/travis/elado/class-decorators/master.svg?style=flat-square)](https://travis-ci.org/elado/class-decorators) [![npm version](https://img.shields.io/npm/v/class-decorators.svg?style=flat-square)](https://www.npmjs.com/package/class-decorators) [![codeclimate](https://img.shields.io/codeclimate/github/elado/class-decorators.svg?style=flat-square)](https://codeclimate.com/github/elado/class-decorators)

## Installation

```sh
npm install class-decorators --save
```

## Usage

```js
import klass from 'class-decorators'

@klass
class SomeClass {
  publicMethod() {
    return 1
  }

  publicMethodThatUsesAPrivateMethod() {
    return 2 + this.privateMethod()
  }

  @klass.private
  privateMethod() {
    return 3
  }
}

const something = new SomeClass()
something.publicMethod() // => 1
something.privateMethod() // => TypeError: something.privateMethod is not a function
something.publicMethodThatUsesAPrivateMethod() // => 5
```

## Test

```sh
npm install
npm test
```

## License

MIT
