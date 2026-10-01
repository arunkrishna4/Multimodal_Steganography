import { Request, Response } from "express";

import {
    ExtractResponse,
} from "../types/extract.types";

import {
    extractMessage,
} from "../services/extract.service";


export const extract = async (
    req: Request,
    res: Response<ExtractResponse>
) => {

    try {

        // 1. Check uploaded files
        const files = req.files as {
            stegoFiles?: Express.Multer.File[];
        } | undefined;

        if (!files?.stegoFiles || files.stegoFiles.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No stego files uploaded.",
            });
        }


        // 2. Validate uploaded files
        const stegoFiles = files.stegoFiles;

        for (const file of stegoFiles) {

            const isImage =

                file.mimetype === "image/png";

            const isAudio =
                file.mimetype === "audio/mpeg" ||
                file.mimetype === "audio/wav" ||
                file.mimetype === "audio/x-wav" ||
                file.originalname.toLowerCase().endsWith(".mp3") ||
                file.originalname.toLowerCase().endsWith(".wav");

            if (!isImage && !isAudio) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid file type. Only JPEG, PNG, MP3, and WAV files are allowed.",
                });
            }
        }


        // 3. Get selected methods
        const selectedMethodsRaw = req.body.selectedMethods;

        if (!selectedMethodsRaw) {
            return res.status(400).json({
                success: false,
                error: "Missing required field: selectedMethods.",
            });
        }

        let selectedMethods: {
            mediaType: "image" | "audio";
            methodId: string;
            numberOfFiles: number;
        }[];

        try {
            selectedMethods = JSON.parse(selectedMethodsRaw);
        } catch {
            return res.status(400).json({
                success: false,
                error: "Invalid selectedMethods data.",
            });
        }


        // 4. Prepare media files for Python service
        const pythonMediaFiles = stegoFiles.map((file) => {
            let mediaType: "image" | "audio";

            if (file.mimetype.startsWith("image/")) {
                mediaType = "image";
            } else {
                mediaType = "audio";
            }

            const selectedMethod = selectedMethods.find(
                (item) => item.mediaType === mediaType
            );

            if (!selectedMethod) {
                throw new Error(
                    `No steganography method selected for ${mediaType}.`
                );
            }

            return {
                type: mediaType,
                method: selectedMethod.methodId,
                input_path: file.path,
            };
        });


        // 5. Call service
        const result = await extractMessage(pythonMediaFiles);

        // 6. Return frontend response
        return res.status(200).json({
            success: true,
            result: {
                mediaFiles: result.mediaFiles,
                messageLength: result.messageLength,
                extractedMessage: result.extractedMessage,
            },
        });

    } catch (error) {

        console.error("========== EXTRACT ERROR ==========");
        console.error(error);
        console.error("===================================");

        return res.status(500).json({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Extraction failed.",
        });
    }
};