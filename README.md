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

So first I will need a function that receives an instance of espress, a route object, and a function for errors. This route object will be something like this

```json
{
    "method": "post",
    "url": "/essay",
    "fn": () => {}
}
```

Then the function can be as simple as this

```javascript
export const setRoute = ({
    route = {},
    expressInstance = {},
    genericErrorFn = () => {}
} = {}) => {
    expressInstance[route.method](route.url, route.fn, route.errorFn || genericErrorFn)
    return expressInstance
}
```

To understand for easily, think about this as:
```javascript
app.get('/myroute', functionToReceive, functionForErrors)
```

And we will need a function for an array of routes, like this:

```javascript
export const setAllRoutes = (
    expressInstance = {},
    routes = [],
    setRouteFn = setRoute
} = {}) => {
    routes.forEach(route => setRouteFn({route, expressInstance}))
    return expressInstance
}
```

Very simple functions, lets test them:
```javascript
describe('Main Router', () => {
    it('Should call function for every route', () => {
        const fn = () => {}
        const routes = [1,2,3,4,5]
        const spyFn = chai.spy(fn)
        setAllRoutes({ routes, setRouteFn: spyFn })

        expect(spyFn).to.have.been.called.exactly(5)
    })

    it('Should call function for every route', () => {
        const fn = () => {}
        const spyFn = chai.spy(fn)
        const instance = {
            get: spyFn
        }
        const route = {
            method: 'get'
        }

        setRoute({ route, expressInstance: instance })

        expect(spyFn).to.have.been.called.exactly(1)
    })
})
```

Now I will make our first generic routes, like this:
```javascript
export const rootRoutes = [{
    method: 'get',
    url: '/',
    fn: (_, res) => res.send('Index page!!')
}]

export const notFoundRoutes = [{
    method: 'get',
    url: '*',
    fn: (_, res) => res.status('404').send('Page not found!')
}]
```

Import them on main router an use as default routes:
```javascript
export const setAllRoutes = ({
    expressInstance = {},
    routes = [
        ...rootRoutes,
        ...notFoundRoutes
    ],
    setRouteFn = setRoute
} = {})
```

And replace our old `setRoute` by this new `setAllRoutes`.

## Going a bit lower

As we already have a nice routing working, lets try to make an endpoint to return stuff drom my application.

Lets create a Controller:
```javascript
import { findAll } from '../models/books'

export const getAll = (_, response) => response.status(200).send(findAll())

```
and its model:
```javascript
export const findAll = () => [
    {
        'name': 'The Little Prince',
        'country': 'France'
    },
    {
        'name': 'Os Lusiadas',
        'country': 'Portugal'
    },
    {
        'name': 'Sophie`s World',
        'country': 'Norway'
    }
}]

```

To connect it to our router we will need a books router:
```javascript
import { getAll } from '../controllers/books'
export const booksRoutes = [{
    method: 'get',
    url: '/books',
    fn: getAll
}]

```
And use is on mainRouter:
```javascript
export const setAllRoutes = ({
    expressInstance = {},
    routes = [
        ...rootRoutes,
        ...booksRoutes,
        ...notFoundRoutes
    ],
    setRouteFn = setRoute
} = {})
```

That is it, we have a new endpoint!

## Adding a database
Lets add a database to this project?

I like to use nedb for these samples because it is embedded, js, npm, mongodb bla, bla. So lets install it:
```javascript
npm i -s nedb
```

Then I like to make a connection file like this:
```javascript
import Datastore from 'nedb'

export const getLoadedDatabase = (name, databaseLoadFn = Datastore) => (new databaseLoadFn({filename: name, autoload: true}))

export const getBooksDatabase = (getDatabaseFn = getLoadedDatabase) => getDatabaseFn('db/books.db')
```

So we have a generic function for loading different collections with autoload on. And another one that receives the first function and call it with the path of the choosen file.

I like to make a seed file for this entity, so we can have a working database for every 'get' operation we might want.

```javascript
import fs from 'fs'
import { getBooksDatabase } from './src/db/connector'
const dir = './db'

if (!fs.existsSync(dir))
    fs.mkdirSync(dir)

const books = [
    {
        'name': 'The Little Prince',
        'country': 'France'
    },
    {
        'name': 'Os Lusiadas',
        'country': 'Portugal'
    },
    {
        'name': 'Sophie`s World',
        'country': 'Norway'
    }
]

const db = getBooksDatabase()

books.forEach(book => db.insert(book, (err, doc) =>{
    if (err) {
        console.log(err)
        return 1
    }

    console.log(`Book ${book.name} included under id ${doc._id}.`)
    return 0
}))
```

You can add it to your script on package.json
```javascript
'seed': 'node -r esm ./seed.js'
```
Don`t forget esm!

So, after running it...
```javascript
npm run seed
```

Lets change our model, it now needs to return a promise wrapping nedb function, because unfortunetly it does not support promises:

```javascript
export const findAll = (getBooksDatabaseFn = getBooksDatabase) =>
    new Promise((resolve, reject) =>
        getBooksDatabaseFn()
            .find({}, (err, doc) =>
                err ? reject(err) : resolve(doc)))
```
If the find function runs with error, the promise will be rejected. Otherwise, it resolves with docs found.

Now just a small adjust on controller:
```javascript
export const getAll = (_, response) =>
    findAll().then(books => response.status(200).send(books))
```

That is it, we have now an endpoint returning stuff from database. Let`s test those functions?

## An important notes

### Inversion of control and testability
I believe I had noticed one thing: some of those functions have lots of parameters, this is important for us to be able to test.

Everything is testable.

If any other functions are called inside a function, they must be received as a parameter.
