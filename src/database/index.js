import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/API");
mongoose.Promise = global.Promise;

export default mongoose;