import type { Request, Response } from "express";
import { compareMessages } from "../services/compare.service";
import type {
    CompareRequest,
    CompareResponse,
} from "../types/compare.types";

export const compare = (
    req: Request,
    res: Response<CompareResponse>,
) => {
    const { originalMessage: rawOriginalMessage, extractedMessage } =
        req.body ?? {};

    let originalMessage: string;

    // Original message from uploaded file
    if (req.file) {
        const isTextFile =
            req.file.mimetype === "text/plain" ||
            req.file.originalname.toLowerCase().endsWith(".txt");

        if (!isTextFile) {
            return res.status(400).json({
                success: false,
                error: "Invalid file: originalFile must be a .txt file.",
            });
        }

        originalMessage = req.file.buffer.toString("utf-8");
    }
    // Original message from pasted text / JSON request
    else if (typeof rawOriginalMessage === "string") {
        originalMessage = rawOriginalMessage;
    } else {
        return res.status(400).json({
            success: false,
            error: "Missing required field: originalFile or originalMessage.",
        });
    }

    if (typeof extractedMessage !== "string") {
        return res.status(400).json({
            success: false,
            error: "Missing or invalid field: extractedMessage must be a string.",
        });
    }

    // Normalize both messages consistently
    const normalizeMessage = (message: string) =>
        message
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();

    const request: CompareRequest = {
        originalMessage: normalizeMessage(originalMessage),
        extractedMessage: normalizeMessage(extractedMessage),
    };

    const comparison = compareMessages(request);

    return res.status(200).json({
        success: true,
        result: comparison,
    });
};