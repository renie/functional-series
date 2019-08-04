import { getBooksDatabase } from '../db/connector'

export const findAll = (getBooksDatabaseFn = getBooksDatabase) =>
    new Promise((resolve, reject) =>
        getBooksDatabaseFn()
            .find({}, (err, doc) =>
                err ? reject(err) : resolve(doc)))
