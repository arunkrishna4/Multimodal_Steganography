import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const downloadFile = (
    req: Request,
    res: Response,
) => {

    const { filename } = req.params;

    if (!filename) {
        return res.status(400).json({
            success: false,
            error: "Missing filename.",
        });
    }

    // Only allow filenames, not paths
    if (
        filename.includes("/") ||
        filename.includes("\\") ||
        filename.includes("..")
    ) {
        return res.status(400).json({
            success: false,
            error: "Invalid filename.",
        });
    }

    const outputDirectory = path.resolve(
        process.cwd(),
        "uploads",
        "output",
    );

    const filePath = path.join(
        outputDirectory,
        filename as string,
    );

    // Check whether file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            error: "File not found.",
        });
    }

    return res.download(
        filePath,
        filename as string,
        (error) => {

            if (error) {
                console.error(
                    "File download error:",
                    error,
                );
            }

        },
    );
};