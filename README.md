# Functional backend node articles

For some time I googled for articles about functional architetures for node js projects, from scratch. I wont lie, I`ve got very good articles
about functional paradigms but not whole architeture as I was looking for. So I`ve decided to try my own and share, and I would be really glad to
read interesting ideas on comments.

## Beggining
So I`ve decided to start with starting a new project with [ESM](https://www.npmjs.com/package/esm) enabled. This will be needed for ES6 modules
loading without bundles or babel.
```
npm init esm -y
```

This will create an `index.js` to serve as entry point and do the job of making 'import' and 'export' work in the rest of our code. So our app
shoud start on `main.js`.

This is also described on our `package.json` already. Lot lets just add a script on our `package.json`:
```
"start": "node index.js",
```

I will want to export a function on my `main.js` so I have to call this function on `index.js` require:
```
module.exports = require("./main.js")()
```

Because I am doing this, I should change the export of `main.js` to cjs style:
```
module.exports = App
```

## Testing
Before coding, lets add some test libraries to our project:

```
npm i -D mocha chai chai-spies
```

For now this is enough for testing. Lets add a new script on our package json for running tests

```
"test": "npx mocha ./**/*.test.js  --require esm"
```
In other words: run mocha for all `test.js files, with esm enabled`

Good!

Lets write a simple test to start:
```
import assert from 'assert'
import chai from 'chai'
import spies from 'chai-spies'

const main = require('./main')

chai.use(spies)
const expect = chai.expect

describe('Main', () => {
    it('should return true', () => {
        const logFn = () => {}
        const spyFn = chai.spy(logFn)
        main({ logFn: spyFn })
        expect(spyFn).to.have.been.called.exactly(1)
    })
})
```

And now the `main.js` to be tested:
```
const App = ({ logFn = console.log }) => logFn({ message: 'Starting App...' })

module.exports = App
```

Now when we run `npm test`, we should get a valid test for main.

## What about ESM?
From `main.js` on we can use our ESM. Lets write a utils file with a log function, as well as its test, to check if everything is ok:
```
export const log = ({ message = 'My Message', logFn = console.log } = {}) => logFn(message)
```

Test is simple: Importing function, test if function is called just once and with right parameter.
```
import assert from 'assert'
import chai from 'chai'
import spies from 'chai-spies'

import { log } from './utils'

chai.use(spies)
const expect = chai.expect

describe('Utils', () => {
    it('should log', () => {
        const logFn = () => {}
        const message = 'New message'
        const spyFn = chai.spy(logFn)
        log({ message, logFn: spyFn })

        expect(spyFn).to.have.been.called.exactly(1)
        expect(spyFn).to.have.been.called.with(message)
    })
})
```

Now it is done and tested, lets import it on `main.js`:
```
import { log } from './utils'

const App = ({ logFn = log } = {}) => logFn({ message: 'Starting App...' })

module.exports = App
```
