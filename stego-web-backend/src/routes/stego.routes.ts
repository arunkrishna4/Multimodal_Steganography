import { Router } from "express";
import { compare } from "../controllers/compare.controller";
import multer from "multer";

const router = Router();

//splitting and embedding the data into the cover files
router.post("/split-and-embed", (req, res) => {
    res.json({
        message: "Split and embed API reached",
    });
});

//extracting from the stego files
router.post("/extract", (req, res) => {
    res.json({
        message: "Extract API reached",
    });
});

//comparing orginal and extracted
const upload = multer({
    storage: multer.memoryStorage(),
});

router.post(
    "/compare",
    upload.single("originalFile"),
    compare
);

export default router;