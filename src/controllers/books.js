import { findAll } from '../models/books'

export const getAll = (_, response) => response.status(200).send(findAll())
