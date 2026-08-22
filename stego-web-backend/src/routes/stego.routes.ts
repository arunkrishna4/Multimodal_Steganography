import { Router } from "express";
import { compare } from "../controllers/compare.controller";
import multer from "multer";
import { splitAndEmbedController } from "../controllers/split-and-embed.controller";
import path from "path";
import fs from "fs";

const router = Router();

//splitting and embedding the data into the cover files
const inputDirectory = path.resolve(
    process.cwd(),
    "uploads",
    "input",
);

fs.mkdirSync(inputDirectory, {
    recursive: true,
});

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, inputDirectory);
    },

    filename: (_req, file, cb) => {
        const extension = path.extname(
            file.originalname,
        );

        const filename =
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}${extension}`;

        cb(null, filename);
    },
});

const uploadSplitAndEmbed = multer({
    storage,
});

router.post(
    "/split-and-embed",
    uploadSplitAndEmbed.fields([
        {
            name: "originalFile",
            maxCount: 1,
        },
        {
            name: "mediaFiles",
            maxCount: 20,
        },
    ]),
    splitAndEmbedController,
);



//extracting from the stego files
router.post("/extract", (req, res) => {
    res.json({
        message: "Extract API reached",
    });
});


//multer configuration for file upload
const upload = multer({
    storage: multer.memoryStorage(),
});
//comparing orginal and extracted
router.post(
    "/compare",
    upload.single("originalFile"),
    compare
);

export default router;