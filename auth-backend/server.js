require('dotenv').config()
const app = require('./src/app')
const { connectDB } = require('./src/config/database')

const PORT = process.env.PORT || 5000
// Подключение к базе данных
connectDB()

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`📁 SQLite database: database.sqlite`)
})
