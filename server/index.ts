import express from 'express'
import next from 'next'
import * as dotenv from 'dotenv'
import routes from './routes'
import bodyParser from 'body-parser'

dotenv.config()

const port = process.env.PORT || 8000
const dev: boolean = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()

/**
 * App Configuration
 */

// server.use(cors());
server.use(bodyParser.json()) // parse application/json
server.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
server.use(routes)

app.prepare().then(() => {
    server.all('*', (req: any, res: any) => {
        return handle(req, res)
    })

    server.listen(port, () => {
        console.log(`> Server listening on port ${port}`)
    })

    server.on('error', (e) => console.error('Server Error', e))
})
