import { Request, Response } from "express";

import {
    CompareRequest,
    CompareResponse,
} from "../types/compare.types";

import { compareMessages } from "../services/compare.service";

export const compare = (
    req: Request,
    res: Response<CompareResponse>
) => {

    // Check original file
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: "Missing required field: originalFile.",
        });
    }


    // Check extracted message
    const { extractedMessage } = req.body;

    if (extractedMessage === undefined) {
        return res.status(400).json({
            success: false,
            error: "Missing required field: extractedMessage.",
        });
    }

    if (typeof extractedMessage !== "string") {
        return res.status(400).json({
            success: false,
            error: "Invalid field: extractedMessage must be a string.",
        });
    }


    // Validate file type
    if (
        req.file.mimetype !== "text/plain" &&
        !req.file.originalname.toLowerCase().endsWith(".txt")
    ) {
        return res.status(400).json({
            success: false,
            error: "Invalid file: originalFile must be a .txt file.",
        });
    }


    // Read original message from file
    const originalMessage =
        req.file.buffer.toString("utf-8");


    // Compare
    const request: CompareRequest = {
        originalMessage,
        extractedMessage,
    };

    const comparison = compareMessages(request);

    return res.status(200).json({
        success: true,
        result: comparison,
    });
};