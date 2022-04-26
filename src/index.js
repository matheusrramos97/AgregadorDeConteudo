import express from "express";
import bodyParser from "body-parser";
import authController from "./controllers/authController.js";
import videoController from "./controllers/videoController.js";
import categoryController from "./controllers/categoryController.js";
import cors from "./middlewares/cors.js";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);

authController(app);
videoController(app);
categoryController(app);

app.listen(5000, () => {
    console.log("Server is running on port 3000");
});