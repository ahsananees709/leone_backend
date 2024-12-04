import { DATABASE_URL } from "./src/utils/constant.js"


export default {
  dialect: "mysql",
  schema: "./db/schema",
  out: "./migrations",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
}
