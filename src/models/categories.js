import mongoose from "../database/index.js";
import mongoosePaginate from "mongoose-paginate-v2";

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

CategorySchema.plugin(mongoosePaginate);

const Category = mongoose.model("Category", CategorySchema);
export default Category;