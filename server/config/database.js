import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_URL } = process.env;

export default function connect() {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlparser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB Connection Success`))
    .catch((err) => {
      console.log(`DB Connection Failed`);
      console.log(err);
      process.exit(1);
    });
}
