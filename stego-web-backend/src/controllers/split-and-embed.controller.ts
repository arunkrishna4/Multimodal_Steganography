import { Request, Response } from "express";
import path from "path";
import { splitAndEmbed } from "../services/split-and-embed.service";
import type { SplitEmbedResponse } from "../types/split-and-embed.types";

interface SelectedMethodRequest {
    mediaType: "image" | "audio";
    methodId: string;
    numberOfFiles: number;
}

export const splitAndEmbedController = async (
    req: Request,
    res: Response<SplitEmbedResponse>,
) => {
    try {
        const files = req.files as
            | {
                originalFile?: Express.Multer.File[];
                mediaFiles?: Express.Multer.File[];
            }
            | undefined;

        // -----------------------------------
        // 1. Validate original file
        // -----------------------------------

        const originalFile = files?.originalFile?.[0];

        if (!originalFile) {
            return res.status(400).json({
                success: false,
                error: "Missing required field: originalFile.",
            });
        }

        // -----------------------------------
        // 2. Validate media files
        // -----------------------------------

        const mediaFiles = files?.mediaFiles;

        if (!mediaFiles || mediaFiles.length === 0) {
            return res.status(400).json({
                success: false,
                error: "At least one media file is required.",
            });
        }

        // -----------------------------------
        // 3. Validate original file type
        // -----------------------------------

        if (
            originalFile.mimetype !== "text/plain" &&
            !originalFile.originalname.toLowerCase().endsWith(".txt")
        ) {
            return res.status(400).json({
                success: false,
                error: "Invalid file: originalFile must be a .txt file.",
            });
        }

        // -----------------------------------
        // 4. Read secret message
        // -----------------------------------

        const fs = await import("fs/promises");

        const message = await fs.readFile(
            originalFile.path,
            "utf-8",
        );

        if (!message.trim()) {
            return res.status(400).json({
                success: false,
                error: "The originalFile cannot be empty.",
            });
        }

        // -----------------------------------
        // 5. Read selected methods
        // -----------------------------------

        const selectedMethodsRaw = req.body.selectedMethods;

        if (!selectedMethodsRaw) {
            return res.status(400).json({
                success: false,
                error: "Missing required field: selectedMethods.",
            });
        }

        let selectedMethods: SelectedMethodRequest[];

        try {
            selectedMethods = JSON.parse(selectedMethodsRaw);
        } catch {
            return res.status(400).json({
                success: false,
                error: "Invalid selectedMethods data.",
            });
        }

        if (
            !Array.isArray(selectedMethods) ||
            selectedMethods.length === 0
        ) {
            return res.status(400).json({
                success: false,
                error: "At least one steganography method must be selected.",
            });
        }

        // -----------------------------------
        // 6. Supported methods
        // -----------------------------------

        const validMethodsByMediaType: Record<
            string,
            Set<string>
        > = {
            image: new Set([
                "lsb-substitution",
                "5-lsb-substitution",
                "6-lsb-substitution",
                "5&6-lsb-substitution",
            ]),

            audio: new Set([
                "audio-lsb",
            ]),
        };

        // -----------------------------------
        // 7. Validate selected methods
        // -----------------------------------

        for (const selectedMethod of selectedMethods) {
            const validMethods =
                validMethodsByMediaType[selectedMethod.mediaType];

            if (!validMethods) {
                return res.status(400).json({
                    success: false,
                    error: `Unsupported media type: ${selectedMethod.mediaType}`,
                });
            }

            if (!validMethods.has(selectedMethod.methodId)) {
                return res.status(400).json({
                    success: false,
                    error: `Unsupported method '${selectedMethod.methodId}' for ${selectedMethod.mediaType}.`,
                });
            }
        }

        // -----------------------------------
        // 8. Create output directory
        // -----------------------------------

        const outputDir = path.resolve(
            process.cwd(),
            "uploads",
            "output",
        );

        await fs.mkdir(outputDir, {
            recursive: true,
        });

        // -----------------------------------
        // 9. Convert uploaded files for Python
        // -----------------------------------

        const pythonMediaFiles = mediaFiles.map(
            (file, index) => {
                let mediaType: "image" | "audio";

                if (file.mimetype.startsWith("image/png")) {
                    mediaType = "image";
                } else if (file.mimetype.startsWith("audio/")) {
                    mediaType = "audio";
                } else {
                    throw new Error(
                        `Unsupported media type: ${file.mimetype}`,
                    );
                }

                // Find the method selected for this media type
                const selectedMethod = selectedMethods.find(
                    (item) =>
                        item.mediaType === mediaType,
                );

                if (!selectedMethod) {
                    throw new Error(
                        `No steganography method selected for ${mediaType}.`,
                    );
                }

                const extension = path.extname(
                    file.originalname,
                );

                const outputFileName =
                    `stego_${index}${extension}`;

                return {
                    type: mediaType,

                    method: selectedMethod.methodId,

                    input_path: path.resolve(
                        file.path,
                    ),

                    output_path: path.resolve(
                        outputDir,
                        outputFileName,
                    ),
                };
            },
        );

        // -----------------------------------
        // 10. Run Python engine
        // -----------------------------------

        const result = await splitAndEmbed(
            message,
            pythonMediaFiles,
            outputDir,
        );

        return res.status(200).json(result);

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