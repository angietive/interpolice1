import mysql from "mysql2/promise";

// Pool de conexiones para evitar problemas de conexión cerrada
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Pool de conexión a la base de datos creado");

export default pool;

