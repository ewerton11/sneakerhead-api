import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
})

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err)
    process.exit(1)
  }

  console.log('Connected to MySQL!')
})

export default connection
