import { log } from './utils'

const App = ({ logFn = log } = {}) => logFn({ message: 'Starting App...' })

module.exports = App
