import { Request, Response } from "express";
import path from "path";

import {
    splitAndEmbed,
} from "../services/split-and-embed.service";

import type {
    SplitEmbedResponse,
} from "../types/split-and-embed.types";

export const splitAndEmbedController = async (
    req: Request,
    res: Response<SplitEmbedResponse>,
) => {
    try {

        // --------------------------------------------------
        // Uploaded files
        // --------------------------------------------------

        const files = req.files as {
            originalFile?: Express.Multer.File[];
            mediaFiles?: Express.Multer.File[];
        } | undefined;


        // --------------------------------------------------
        // Check original secret file
        // --------------------------------------------------

        const originalFile =
            files?.originalFile?.[0];

        if (!originalFile) {
            return res.status(400).json({
                success: false,
                error:
                    "Missing required field: originalFile.",
            });
        }


        // --------------------------------------------------
        // Check media files
        // --------------------------------------------------

        const mediaFiles =
            files?.mediaFiles;

        if (
            !mediaFiles ||
            mediaFiles.length === 0
        ) {
            return res.status(400).json({
                success: false,
                error:
                    "At least one media file is required.",
            });
        }


        // --------------------------------------------------
        // Validate secret file
        // --------------------------------------------------

        if (
            originalFile.mimetype !== "text/plain" &&
            !originalFile.originalname
                .toLowerCase()
                .endsWith(".txt")
        ) {
            return res.status(400).json({
                success: false,
                error:
                    "Invalid file: originalFile must be a .txt file.",
            });
        }


        // --------------------------------------------------
        // Read secret message
        // --------------------------------------------------

        const fs = await import("fs/promises");

        const message =
            await fs.readFile(
                originalFile.path,
                "utf-8",
            );


        if (!message.trim()) {
            return res.status(400).json({
                success: false,
                error:
                    "The originalFile cannot be empty.",
            });
        }


        // --------------------------------------------------
        // Output directory
        // --------------------------------------------------

        const outputDir = path.resolve(
            process.cwd(),
            "uploads",
            "output",
        );

        await fs.mkdir(
            outputDir,
            {
                recursive: true,
            },
        );


        // --------------------------------------------------
        // Build Python media configuration
        // --------------------------------------------------

        const pythonMediaFiles =
            mediaFiles.map(
                (file, index) => {

                    let mediaType:
                        | "image"
                        | "audio";

                    if (
                        file.mimetype.startsWith(
                            "image/",
                        )
                    ) {
                        mediaType = "image";

                    } else if (
                        file.mimetype.startsWith(
                            "audio/",
                        )
                    ) {
                        mediaType = "audio";

                    } else {
                        throw new Error(
                            `Unsupported media type: ${file.mimetype}`,
                        );
                    }


                    const extension =
                        path.extname(
                            file.originalname,
                        );

                    const outputFileName =
                        `stego_${index}${extension}`;


                    return {
                        type: mediaType,

                        input_path:
                            path.resolve(
                                file.path,
                            ),

                        output_path:
                            path.resolve(
                                outputDir,
                                outputFileName,
                            ),
                    };
                },
            );


        // --------------------------------------------------
        // Run Python engine
        // --------------------------------------------------

        const result =
            await splitAndEmbed(
                message,
                pythonMediaFiles,
                outputDir,
            );


        // --------------------------------------------------
        // Return result
        // --------------------------------------------------

        return res.status(200).json(
            result,
        );

    } catch (error) {

        console.error(
            "Split and embed error:",
            error,
        );

        return res.status(500).json({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Split and embed operation failed.",
        });
    }
};