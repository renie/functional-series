import { findAll } from '../models/books'

export const getAll = (_, response) =>
    findAll().then(books => response.status(200).send(books))
