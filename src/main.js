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
