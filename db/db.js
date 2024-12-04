// import { drizzle } from "drizzle-orm/node-postgres"
// import pkg from "pg"
// import { DATABASE_URL, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } from "../src/utils/constant.js"

// const { Pool } = pkg

// const pool = new Pool({
//   connectionString: DATABASE_URL || `root://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
// })

// pool
//   .connect()
//   .then(async () => {
//     console.log("Database connection has been established successfully.")
    
//   })

  
//   .catch(err => {
//     console.error("Unable to connect to the database:", err)
//   })

// export const database = drizzle(pool,
//   {
//     schema:
//     {
//       ...user,
//       blackListToken,
//       ...role,
//       ...permission,
//       ...rolePermission,
//       ...vehicle,
//       ...vehicleReview,
//       ...booking,
//       ...favorite,
//       ...userReview,
//       ...conversation,
//       ...message
//     }
//   })


import { DATABASE_URL, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } from "../src/utils/constant.js";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as Product from "./schema/product.js";
import * as ProductRanking from "./schema/productRanking.js";

const poolConnection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

(async () => {
  try {
    const connection = await poolConnection.getConnection();
    console.log("Connection to MySQL database was successful!");
    connection.release();
  } catch (error) {
    console.error("Failed to connect to the MySQL database:", error.message);
  }
})();

export const db = drizzle({ client: poolConnection, schema:{...Product, ...ProductRanking}, mode:  "default"});

