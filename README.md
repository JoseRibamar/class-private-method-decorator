# class-private-method-decorator

> Private methods in a JavaScript ES6 class using an ES7 decorator

[![build status](https://img.shields.io/travis/elado/class-private-method-decorator/master.svg?style=flat-square)](https://travis-ci.org/elado/class-private-method-decorator) [![npm version](https://img.shields.io/npm/v/class-private-method-decorator.svg?style=flat-square)](https://www.npmjs.com/package/class-private-method-decorator) [![codeclimate](https://img.shields.io/codeclimate/github/elado/class-private-method-decorator.svg?style=flat-square)](https://codeclimate.com/github/elado/class-private-method-decorator)

## Installation

```sh
npm install class-private-method-decorator --save
```

## Usage

```js
import klass from 'class-private-method-decorator'

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
