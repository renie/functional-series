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
