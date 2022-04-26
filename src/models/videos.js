import mongoose from "../database/index.js";
import mongoosePaginate from "mongoose-paginate-v2";

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    crearedAt: { 
        type: Date,
        default: Date.now,
    }
});

VideoSchema.plugin(mongoosePaginate);

export default mongoose.model("Video", VideoSchema);