import mongoose from "mongoose";
import baseConfig from "../config/index";

const connect = () => mongoose.connect(baseConfig.dbUrl);

export default connect;
