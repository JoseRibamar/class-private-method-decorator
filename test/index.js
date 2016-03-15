import assert from 'assert'
import klass from '../src'

describe('@klass', function () {
  it('leaves all methods as public by default', function () {
    @klass
    class Something {
      public1(text) { return `public1:${text}` }
      public2(text) { return `public2:${text}` }
    }

    const p = new Something()
    assert.equal(p.public1('hello'), 'public1:hello')
    assert.equal(p.public2('hello'), 'public2:hello')
  })

  it('hides private methods', function () {
    @klass
    class Something {
      public1(text) { return `public1:${text}` }

      @klass.private
      private2(text) { return `private2:${text}` }
    }

    const p = new Something()
    assert.equal(p.public1('hello'), 'public1:hello')
    assert(!('private2' in p))
  })

  it('can still call private methods in the class', function () {
    @klass
    class Something {
      public1(text) { return `public1:${text}|${this.private2(text)}` }

      @klass.private
      private2(text) { return `private2:${text}` }
    }

    const p = new Something()
    assert.equal(p.public1('hello'), 'public1:hello|private2:hello')
  })

  it('can set a new method by assigning a function, and bind to the instance', function () {
    @klass
    class Something {
      public1(text) { return `public1:${text}` }
      public2(text) { return `public2:${text}` }
    }

    const p = new Something()
    assert.equal(p.public1('hello'), 'public1:hello')
    assert.equal(p.public2('hello'), 'public2:hello')

    p.public2 = function (text) { return `patched public2|${this.public1(text)}` }
    assert.equal(p.public2('hello'), 'patched public2|public1:hello')
  })
})
