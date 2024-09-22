import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;


//const pool = new Pool({
  //user: process.env.PGUSER,
  //host: process.env.PGHOST,
  //database: process.env.PGDATABASE,
  //password: process.env.PGPASSWORD,
  //port: process.env.PGPORT,
//});

const pool = new Pool({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  database : process.env.RDS_DB_NAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err.stack);
  } else {
    console.log('Conectado com exito ao banco de dados PostgreSQL');
    release();
  }
});

export default pool;