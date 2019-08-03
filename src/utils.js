export const log = ({ message = 'My Message', logFn = console.log } = {}) => logFn(message)
