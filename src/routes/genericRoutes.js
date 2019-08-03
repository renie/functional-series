export const rootRoutes = [{
    method: 'get',
    url: '/',
    fn: (_, res) => res.send('Index page!!')
}]

export const notFoundRoutes = [{
    method: 'get',
    url: '*',
    fn: (_, res) => res.status('404').send('Page not found!')
}]
