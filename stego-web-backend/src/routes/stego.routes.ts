import { Router } from "express";
import { compare } from "../controllers/compare.controller";
import multer from "multer";
import { splitAndEmbedController } from "../controllers/split-and-embed.controller";
import path from "path";
import fs from "fs";
import { extract } from "../controllers/extract.controller";

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
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
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
            maxCount: 5,
        },
    ]),
    splitAndEmbedController,
);



//extracting from the stego files
const uploadExtract = multer({
    storage,
});
router.post("/extract", uploadExtract.fields([
    {
        name: "stegoFiles",
        maxCount: 5,
    },
]), extract);


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