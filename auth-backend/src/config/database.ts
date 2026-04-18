import pg from 'pg'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: { timestamps: true, underscored: false },
})

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('✅ PostgreSQL database connected successfully')
    const syncOptions = process.env.NODE_ENV === 'development' ? { alter: true } : {}
    await sequelize.sync(syncOptions)
    console.log('✅ Database synchronized')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}

export { sequelize }
