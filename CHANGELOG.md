# Change Log

## [2.1.0] - 2016-06-22

- Better handling of bound methods
- Support static methods and properties
- Support for prototype altering after class definition

## [2.0.1] - 2016-04-08

- Made properties `configurable: true`

## [2.0.0] - 2016-03-22
### Added `__origInstance`
For easier debugging in console, added `__origInstance` to every class with private methods.

### API Change

#### `1.x`

```js
import klass from 'class-private-method-decorator'

@klass
class C {
  @klass.private
  p() {}
}
```

#### `2.0.0`

```js
import { classWithPrivateMethods, privateMethod } from 'class-private-method-decorator'

@classWithPrivateMethods
class C {
  @privateMethod
  p() {}
}
```
