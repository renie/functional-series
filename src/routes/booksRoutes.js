import { getAll } from '../controllers/books'

export const booksRoutes = [{
    method: 'get',
    url: '/books',
    fn: getAll
}]
