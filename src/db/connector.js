import Datastore from 'nedb'

export const getLoadedDatabase = (name, databaseLoadFn = Datastore) => (new databaseLoadFn({filename:name, autoload: true}))

export const getBooksDatabase = (getDatabaseFn = getLoadedDatabase) => getDatabaseFn('db/books.db')
