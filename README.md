# Functional backend node articles

For some time I have beem googling for articles about functional architectures for nodejs projects, from scratch. I wont lie, I've got very good articles
about functional paradigms but not whole architecture as I was looking for. So I've decided to try my own and share, and I would be really glad to get feedback in comments.

## Beggining
So I've decided to start with a new project with [ESM](https://www.npmjs.com/package/esm) enabled. This will be needed for ES6 modules
loading without bundles or babel.
```javascript
npm init esm -y
```

This will create an `index.js` to serve as entry point and do the job of making 'import' and 'export' work in the rest of our code. So our app
shoud start on `main.js`.

This is also described on our `package.json` already. So let's just add a script on our `package.json`:
```javascript
"start": "node index.js"
```

I will have to export a function on my `main.js` so I have to call this function on `index.js` require:
```javascript
module.exports = require("./main.js")()
```

Because I am doing this, I have to change the export of `main.js` to cjs style:

```javascript
module.exports = App
```

## Testing
Before coding, let's add some test libraries to our project:

```javascript
npm i -D mocha chai chai-spies
```

For now this is enough for testing. Lets add a new script on our package json for running tests

```javascript
"test": "npx mocha ./**/*.test.js  --require esm"
```
In other words: run mocha for all `test.js` files, with esm enabled

Good!

Let's write a simple test to start:
```javascript
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
```javascript
const App = ({ logFn = console.log }) => logFn({ message: 'Starting App...' })

module.exports = App
```

Now when we run `npm test`, we should get a valid test for main.

## What about ESM?
From `main.js` on we can use our ESM. Let's write a utils file with a log function, as well as its test, to check if everything is ok:
```javascript
export const log = ({ message = 'My Message', logFn = console.log } = {}) => logFn(message)
```

Test is simple: Importing function, test if function is called just once and with right parameter.
```javascript
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

Now it is done and tested, let's import it on `main.js`:
```javascript
import { log } from './utils'

const App = ({ logFn = log } = {}) => logFn({ message: 'Starting App...' })

module.exports = App
```

## Including webserver

Now we have ESM and tests configured, you should be on this [state](https://github.com/renie/functional-series/tree/b67cb704920c622b8a625e6502c1d95637814585), we can try to make some interesting stuff.

So now install express:
```javascript
npm i -S express
```

For this purpose I would make 3 functions:
```javascript
import { log } from './utils'

export const getExpressInstance = expressLib => expressLib()

export const setRoute = ({ expressInstance }) => {
    expressInstance.get('/', (_, res) =>
        res.status(200).send({ message: 'Root route called' }))
    return expressInstance
}

export const startServer = ({ expressInstance, port = defaultPort, logFn = log }) =>
    expressInstance.listen(port, () =>
        logFn({ message: `\n\nServer listening at port ${port}...` }))
```

First one creates an instance of Express, second will just set one route and return express instance, and third will boot up our server and warn it on console.

As these functions are really small, they are very easy to test:

```javascript
import assert from 'assert'
import chai from 'chai'
import spies from 'chai-spies'

import {
    setRoute,
    startServer,
    getExpressInstance
} from './webServer'

chai.use(spies)
const expect = chai.expect

describe('Web Server', () => {
    it('should create and instance of lib', () => {
        const logFn = () => {}
        const spyFn = chai.spy(logFn)
        getExpressInstance(spyFn)
        expect(spyFn).to.have.been.called.exactly(1)
    })

    it('should set a route to instance', () => {
        const getFn = () => {}
        const spyFn = chai.spy(getFn)
        const expressInstance = {
            get: spyFn
        }

        setRoute({ expressInstance })
        expect(spyFn).to.have.been.called.with('/')
    })

    it('should start server on right port', () => {
        const getFn = () => {}
        const spyFn = chai.spy(getFn)
        const expressInstance = {
            listen: spyFn
        }

        startServer({ expressInstance, port: 2000 })
        expect(spyFn).to.have.been.called.with(2000)
    })
})
```

Now I just have to tie everything together on App fn:

```javascript
import express from 'express'

import {
    setRoute,
    startServer,
    getExpressInstance
} from './webServer'

const defaultPort = 3000

module.exports = ({
    expressLib = express,
    getExpressInstanceFn = getExpressInstance,
    setRouteFn = setRoute,
    startServerFn = startServer,
    port = defaultPort
} = {}) => {
    const expressInstance = getExpressInstanceFn(expressLib)
    const routedInstance = setRouteFn({ expressInstance })
    startServerFn({
        expressInstance: routedInstance,
        port
    })
}
```
So, I am importing those functions, creating an instance of export, and starting server with an already routed instance of express.

Ofc, we need to change our test for this, huh:

```javascript
import assert from 'assert'
import chai from 'chai'
import spies from 'chai-spies'

const main = require('./main')

chai.use(spies)
const expect = chai.expect

describe('Main', () => {
    it('should return true', () => {
        const instance = { }
        const getExpressInstanceFn = () => instance
        const getExpressInstanceFnSpy = chai.spy(getExpressInstanceFn)

        const setRouteFn = ({ expressInstance }) => expressInstance
        const setRouteFnSpy = chai.spy(setRouteFn)

        const startServerFn = () => {}
        const startServerFnSpy = chai.spy(startServerFn)

        main({
            expressLib: {},
            getExpressInstanceFn: getExpressInstanceFnSpy,
            setRouteFn: setRouteFnSpy,
            startServerFn: startServerFnSpy,
            port: 2000
        })

        expect(getExpressInstanceFnSpy).to.have.been.called.exactly(1)
        expect(getExpressInstanceFnSpy).to.have.been.called.with({})

        expect(setRouteFnSpy).to.have.been.called.exactly(1)
        expect(setRouteFnSpy).to.have.been.called.with({expressInstance: instance})

        expect(startServerFnSpy).to.have.been.called.exactly(1)
        expect(startServerFnSpy).to.have.been.called.with({expressInstance: instance, port: 2000})

    })
})
```

## Making routes more scalable

Now we have a server responding, lets make that `setRoute` a bit more 'real life'.

But before continuing, I will, in my repository, put everything we did so far, but the index file, on a src folder. And separate test files as well. Just to keep organization.

