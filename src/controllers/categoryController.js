import express from "express";
import Category from "../models/categories.js";
import Videos from "../models/videos.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", async (req, res) => {
    try {

        if (!req.body.title || !req.body.color)
            return res.status(400).send({ error: "Title and color are required" });
        
        if(await Category.findOne({ title: req.body.title }))
            return res.status(400).send({ error: "Category already exists" });

        const category = await Category.create(req.body);
        return res.send({ category });
    } catch (error) {
        return res.status(400).send({ error: "Error creating category" });
    }
});

router.get("/", async (req, res) => {

    const page = req.query.page || 1;

    try {
        const categories = await Category.paginate({}, {page: page, limit: 5});
        if (!categories) return res.status(400).send({ error: "Categories not found" });
        return res.send({ categories });
    } catch (error) {
        return res.status(400).send({ error: "Error loading categories" });
    }
});

router.get("/:id/videos", async (req, res) => {

    const page = req.query.page || 1;

    try {
        if (!req.params.id) return res.status(400).send({ error: "Id is required" });

        const category = await Category.findById(req.params.id);

        if (!category) return res.status(400).send({ error: "Category not found" });

        const videos = await Videos.paginate({ category: req.params.id }, { page: page, limit: 5, populate: ["category"] });
        return res.send({ videos });
    } catch (error) {
        return res.status(400).send({ error: "Error loading videos - " + error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).send({ error: "Id is required" });

        const category = await Category.findById(req.params.id);

        if (!category) return res.status(400).send({ error: "Category not found" });
        return res.send({ category });
    } catch (error) {
        return res.status(400).send({ error: "Error loading category" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).send({ error: "Id is required" });

        const { title, color } = req.body;

        if (!title & !color)
            return res.status(400).send({ error: "Title or color are required" });

        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(400).send({ error: "Category not found" });
        return res.send({ category });
    } catch (error) {
        return res.status(400).send({ error: "Error updating category" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).send({ error: "Id is required" });

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) return res.status(400).send({ error: "Category not found" });

        return res.send({message: "Category deleted"});
    } catch (error) {
        return res.status(400).send({ error: "Error deleting category" });
    }
});
export default app => app.use("/categories", router);
