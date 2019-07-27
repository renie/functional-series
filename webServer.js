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
