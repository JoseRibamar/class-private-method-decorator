import assert from 'assert'
import { classWithPrivateMethods, privateMethod, extendClassWithPrivateMethods } from '../src'
import EventEmitter from 'events'

describe('@classWithPrivateMethods', function () {
  it('hides private methods', function () {
    @classWithPrivateMethods
    class Something {
      public1(text) { return `public1:${text}` }

      @privateMethod
      private2(text) { return `private2:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.public1('hello'), 'public1:hello')
    assert(!('private2' in instance))
  })

  it('leaves all methods as public by default', function () {
    @classWithPrivateMethods
    class Something {
      public1(text) { return `public1:${text}` }
      public2(text) { return `public2:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.public1('hello'), 'public1:hello')
    assert.equal(instance.public2('hello'), 'public2:hello')
  })

  it('caches bound methods', function () {
    @classWithPrivateMethods
    class Something {
      public1(text) { return `public1:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.public1, instance.public1)
  })

  it('can still call private methods in the class', function () {
    @classWithPrivateMethods
    class Something {
      public1(text) { return `public1:${text}|${this.private2(text)}` }

      @privateMethod
      private2(text) { return `private2:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.public1('hello'), 'public1:hello|private2:hello')
  })

  it('can set a new method by assigning a function, and bind to the instance', function () {
    @classWithPrivateMethods
    class Something {
      public1(text) { return `public1:${text}` }
      public2(text) { return `public2:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.public1('hello'), 'public1:hello')
    assert.equal(instance.public2('hello'), 'public2:hello')

    instance.public2 = function (text) { return `patched public2|${this.public1(text)}` }
    assert.equal(instance.public2('hello'), 'patched public2|public1:hello')
  })

  it('can call inherited methods', function () {
    class Base {
      baseMethod(text) { return `baseMethod:${text}` }
    }

    @classWithPrivateMethods
    class Something extends Base {
      public1(text) { return `public1:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.baseMethod('hello'), 'baseMethod:hello')
  })

  it('can call inherited methods from a classWithPrivateMethods base class', function () {
    @classWithPrivateMethods
    class Base {
      basePublic1(text) { return `basePublic1:${text}` }

      @privateMethod
      basePrivate2(text) { return `basePrivate2:${text}` }
    }

    @classWithPrivateMethods
    class Something extends Base {
      public1(text) { return `public1:${text}` }

      @privateMethod
      private2(text) { return `private2:${text}` }
    }

    const instance = new Something()
    assert.equal(instance.basePublic1('hello'), 'basePublic1:hello')
    assert.equal(instance.public1('hello'), 'public1:hello')
    assert(!('private2' in instance))
  })

  context('altered prototype', function () {
    it('can alter class prototype after class definition', function () {
      @classWithPrivateMethods
      class Something {
        public1(text) { return `public1:${text}` }
      }

      const instance = new Something()

      Something.prototype.public1 = function (text) { return `patched public1:${text}` }
      Something.prototype.newPublic2 = function (text) { return `newPublic2:${text}` }
      assert.equal(instance.public1('hello'), 'patched public1:hello')
      assert.equal(instance.newPublic2('hello'), 'newPublic2:hello')
    })

    it('can access private methods from altered prototype methods', function () {
      @classWithPrivateMethods
      class Something {
        public1(text) { return `public1:${text}` }

        @privateMethod
        private2(text) { return `private2:${text}` }
      }

      const instance = new Something()

      Something.prototype.public1 = function (text) { return `patched public1:${text}|${this.private2(text)}` }
      assert.equal(instance.public1('hello'), 'patched public1:hello|private2:hello')
    })

    it('cannot access private methods from a new prototype method', function () {
      @classWithPrivateMethods
      class Something {
        @privateMethod
        private2(text) { return `private2:${text}` }
      }

      const instance = new Something()

      Something.prototype.newPublic2 = function (text) { return this.private2(text) }
      try {
        instance.newPublic2('hello')
        assert.fail()
      } catch (err) {
        assert.equal(err.name, 'TypeError')
      }
    })

    it('can alter prototype of base class after class definition ', function () {
      @classWithPrivateMethods
      class Base {
        basePublic1(text) { return `basePublic1:${text}` }
        basePublic2(text) { return `basePublic2:${text}` }
      }

      @classWithPrivateMethods
      class Something extends Base {
        public1(text) { return `public1:${text}` }

        @privateMethod
        private2(text) { return `private2:${text}` }
      }

      Base.prototype.basePublic1 = function (text) { return `patched basePublic1:${text}|${this.basePublic2(text)}` }

      const instance = new Something()
      assert.equal(instance.basePublic1('hello'), 'patched basePublic1:hello|basePublic2:hello')
    })

    it('can handle extended prototype', function (done) {
      @classWithPrivateMethods
      class Something {
        public1() {
          this.emit('public1:call')
        }
      }

      extendClassWithPrivateMethods(Something, EventEmitter.prototype)

      const instance = new Something()

      instance.on('public1:call', () => {
        done()
      })

      instance.public1()
    })
  })

  context('statics', function () {
    it('hoists static methods and properties', function () {
      const globalArr = []

      @classWithPrivateMethods
      class Something {
        static prop = 123
        static arr = globalArr
        static static1(text) { return `static1:${text}` }
      }

      assert.equal(Something.static1('hello'), 'static1:hello')
      assert.equal(Something.prop, 123)
      assert.equal(Something.arr, globalArr)
    })

    it('hoists bound static methods that have access to other static properties', function () {
      @classWithPrivateMethods
      class Something {
        static count = 0
        static inc() { this.count++ }

        static arr = []
        static add(item) { this.arr = [ ...this.arr, item ] }

        getArrFromInstance() { return this.constructor.arr }
      }

      assert.equal(Something.count, 0)
      Something.inc()
      Something.inc()
      assert.equal(Something.count, 2)

      Something.count = 4
      assert.equal(Something.__origClass.count, 4)
      assert.equal(Something.count, 4)

      assert.deepEqual(Something.arr, [])
      Something.add('a')
      assert.deepEqual(Something.arr, [ 'a' ])
      const instance = new Something()
      assert.equal(Something.arr, instance.getArrFromInstance())
      assert.deepEqual(instance.getArrFromInstance(), [ 'a' ])

      Something.arr = [ 'x' ]
      assert.deepEqual(instance.getArrFromInstance(), [ 'x' ])
    })
  })
})
