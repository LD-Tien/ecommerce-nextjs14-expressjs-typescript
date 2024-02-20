import mysql, { PoolOptions } from 'mysql2';

const access: PoolOptions = {
  user: 'root',
  database: 'ecommerce',
};

const conn = mysql.createPool(access);

// Log check for connection
conn.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
  connection.release(); // Release the connection
});

export default conn;
