import express from 'express'

import {
    startServer,
    getExpressInstance
} from './webServer'

import { setAllRoutes } from './routes/mainRouter'

const defaultPort = 3000

module.exports = ({
    expressLib = express,
    getExpressInstanceFn = getExpressInstance,
    setAllRoutesFn = setAllRoutes,
    startServerFn = startServer,
    port = defaultPort
} = {}) => {
    const expressInstance = getExpressInstanceFn(expressLib)
    const routedInstance = setAllRoutesFn({ expressInstance })
    startServerFn({
        expressInstance: routedInstance,
        port
    })
}
