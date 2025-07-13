import { connect } from "mongoose";
import { MONGODB_URI } from "../config.js";

async function connectionDb() {
  try {
    await connect(MONGODB_URI);
    console.log("conexion ala base de datos exitosa");
  } catch (err) {
    console.log(err);
  }
}

export default connectionDb;
