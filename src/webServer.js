import { log } from './utils'

export const getExpressInstance = expressLib => expressLib()

export const startServer = ({ expressInstance, port = defaultPort, logFn = log }) =>
    expressInstance.listen(port, () =>
        logFn({ message: `\n\nServer listening at port ${port}...` }))
