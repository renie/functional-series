import {
    rootRoutes,
    notFoundRoutes
} from './genericRoutes'

import { booksRoutes } from './booksRoutes'

export const setRoute = ({
    route = {},
    expressInstance = {},
    genericErrorFn = () => {}
} = {}) => {
    expressInstance[route.method](route.url, route.fn, route.errorFn || genericErrorFn)
    return expressInstance
}

export const setAllRoutes = ({
    expressInstance = {},
    routes = [
        ...rootRoutes,
        ...booksRoutes,
        ...notFoundRoutes
    ],
    setRouteFn = setRoute
} = {}) => {
    routes.forEach(route => setRouteFn({route, expressInstance}))
    return expressInstance
}
