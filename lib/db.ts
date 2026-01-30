import mysql from "mysql2/promise";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

export const db =
  global.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = db;
}
