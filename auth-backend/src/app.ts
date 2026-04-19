import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/database'
import authRoutes from './routes/authRoutes'
import likeRoutes from './routes/likeRoutes'
import dislikeRoutes from './routes/dislikeRoutes'
import subscriptionRoutes from './routes/subscriptionRoutes'
import commentLikeRoutes from './routes/commentLikeRoutes'
import savedVideoRoutes from './routes/savedVideoRoutes'
import userVideoRoutes from './routes/userVideoRoutes'

const app = express()

let dbInitialized = false
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!dbInitialized) {
    await connectDB()
    dbInitialized = true
  }
  next()
})

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:5173']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/videos', likeRoutes)
app.use('/api/videos', dislikeRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/comments', commentLikeRoutes)
app.use('/api/saved', savedVideoRoutes)
app.use('/api/user-videos', userVideoRoutes)

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date(), database: 'PostgreSQL' })
})

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
