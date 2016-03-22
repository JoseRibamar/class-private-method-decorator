# Change Log

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
