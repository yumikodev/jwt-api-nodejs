import mongoose from "mongoose";
import { config } from "dotenv";
config();

mongoose
  .connect(<string>process.env.MONGODB_URI)
  .then((db) => console.log(`Conectado: ${db.connection.name}`))
  .catch((err) => console.error(err));
