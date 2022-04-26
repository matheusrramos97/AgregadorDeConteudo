import express from "express";
import Video from "../models/videos.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
    try{
        const { title, description, category, url } = req.body;
        if (!title || !description || !category || !url)
            return res.status(400).send({ error: "Title, description, category and url are required" });
        if (await Video.findOne({ title }))
            return res.status(400).send({ error: "Video already exists" });

        const video = await Video.create(req.body);

        return res.send({ video });
    }catch (error){
        return res.status(400).send({ error: `Error creating video  - ${error}` });
    }
});

router.get("/", async (req, res) => {

    const page = req.query.page || 1;

    try {
        const videos = await Video.paginate({}, {page: page, limit: 5, populate: ["category"]});

        return res.send({ videos });
    } catch (err) {
        return res.status(400).send({ error: "Error loading videos - " + err.message });
    }
});

router.get("/search/:search", async (req, res) => {

    const page = req.query.page || 1;

    try {
        const videos = await Video.paginate({ title: { $regex: req.params.search, $options: "i" } }, {page: page, limit: 5, populate: ["category"]});

        if (!videos)
            return res.status(400).send({ error: "Video not found" });
        return res.send({ videos });
    } catch (err) {
        return res.status(400).send({ error: "Error loading videos - " + err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).send({ error: "Id is required" });
        const video = await Video.findById(req.params.id).populate("category");
        if(!video) return res.status(404).send({ error: "Video not found" }); 
        return res.send({ video });
    } catch (err) {
        return res.status(400).send({ error: "Error loading video - " + err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, description, url, category } = req.body;

        if(!title & !description & !url & !category)
            return res.status(400).send({ error: "Missing fields" });

        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("category");

        if(!video) return res.status(404).send({ error: "Video not found" }); 

        return res.send({ video });
    } catch (err) {
        return res.status(400).send({ error: "Error updating video - " + err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        return res.send();
    } catch (err) {
        return res.status(400).send({ error: "Error deleting video - " + err.message });
    }
});

export default app => app.use("/videos", router);