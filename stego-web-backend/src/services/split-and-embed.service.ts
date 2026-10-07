import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";

import type {
    SplitEmbedResponse,

} from "../types/split-and-embed.types";


// ============================================================
// TYPES USED BY PYTHON ENGINE
// ============================================================

interface PythonMediaFile {
    type: "image" | "audio";
    input_path: string;
    method?: string;
    output_path: string;
}


interface PythonEmbedConfig {
    message: string;
    mediaFiles: PythonMediaFile[];
    outputDir: string;
}


interface PythonEmbedResult {
    success: boolean;

    totalParts?: number;

    secretMessageLength?: number;

    files?: {
        sequence: number;
        mediaType: "image" | "audio";
        method?: string;
        inputFile: string;
        outputFile: string;
        messageLength: number;
        messageBits: number;
        headerBits: number;
        totalBits: number;
        psnr?: number;
        snr?: number;
        sampleRate?: number;
    }[];

    error?: string;
}


// ============================================================
// RUN PYTHON ENGINE
// ============================================================

const runPythonEngine = (
    operation: "embed" | "extract",
    config: PythonEmbedConfig,
): Promise<PythonEmbedResult> => {

    return new Promise(async (resolve, reject) => {

        try {

            // --------------------------------------------------
            // Locate Python engine
            // --------------------------------------------------

            const pythonScript = path.resolve(
                process.cwd(),
                "python",
                "stego_engine.py",
            );


            // --------------------------------------------------
            // Create temporary directory
            // --------------------------------------------------

            const tempDir = path.resolve(
                process.cwd(),
                "temp",
            );

            await fs.mkdir(
                tempDir,
                {
                    recursive: true,
                },
            );


            // --------------------------------------------------
            // Create temporary config file
            // --------------------------------------------------

            const configPath = path.join(
                tempDir,
                `stego-config-${Date.now()}.json`,
            );

            await fs.writeFile(
                configPath,
                JSON.stringify(config),
                "utf-8",
            );


            // --------------------------------------------------
            // Start Python process
            // --------------------------------------------------

            const pythonProcess = spawn(
                "python3",
                [
                    pythonScript,
                    operation,
                    configPath,
                ],
                {
                    cwd: process.cwd(),
                },
            );


            let stdout = "";
            let stderr = "";


            // --------------------------------------------------
            // Collect stdout
            // --------------------------------------------------

            pythonProcess.stdout.on(
                "data",
                (data) => {
                    stdout += data.toString();
                },
            );


            // --------------------------------------------------
            // Collect stderr
            // --------------------------------------------------

            pythonProcess.stderr.on(
                "data",
                (data) => {
                    stderr += data.toString();
                },
            );


            // --------------------------------------------------
            // Python process error
            // --------------------------------------------------

            pythonProcess.on(
                "error",
                async (error) => {

                    await fs.unlink(
                        configPath,
                    ).catch(() => { });

                    reject(
                        new Error(
                            `Failed to start Python engine: ${error.message}`,
                        ),
                    );
                },
            );


            // --------------------------------------------------
            // Python process finished
            // --------------------------------------------------

            pythonProcess.on("close", async (code, signal) => {

                // Delete temporary config
                await fs.unlink(
                    configPath,
                ).catch(() => { });


                // Python failed
                if (code !== 0) {
                    reject(
                        new Error(
                            stderr ||
                            stdout ||
                            `Python engine exited with code ${code}, signal ${signal}.`
                        )
                    );
                    return;
                }


                // Parse Python response
                try {

                    const result =
                        JSON.parse(stdout);

                    resolve(result);

                } catch {

                    reject(
                        new Error(
                            "Python engine returned an invalid response.",
                        ),
                    );
                }
            },
            );

        } catch (error) {

            reject(error);
        }
    });
};


// ============================================================
// SPLIT AND EMBED
// ============================================================

export const splitAndEmbed = async (
    message: string,
    mediaFiles: PythonMediaFile[],
    outputDir: string,
): Promise<SplitEmbedResponse> => {

    // --------------------------------------------------------
    // Validate message
    // --------------------------------------------------------

    if (!message.trim()) {
        throw new Error(
            "Secret message cannot be empty.",
        );
    }


    // --------------------------------------------------------
    // Validate media files
    // --------------------------------------------------------

    if (!mediaFiles.length) {
        throw new Error(
            "At least one media file is required.",
        );
    }


    // --------------------------------------------------------
    // Create Python configuration
    // --------------------------------------------------------

    const config: PythonEmbedConfig = {
        message,
        mediaFiles,
        outputDir,
    };


    // --------------------------------------------------------
    // Run Python engine
    // --------------------------------------------------------

    const result = await runPythonEngine(
        "embed",
        config,
    );


    // --------------------------------------------------------
    // Check Python result
    // --------------------------------------------------------

    if (!result.success) {

        throw new Error(
            result.error ||
            "Python engine failed to embed message.",
        );
    }


    // --------------------------------------------------------
    // Make sure required fields exist
    // --------------------------------------------------------

    if (
        result.totalParts === undefined ||
        result.secretMessageLength === undefined ||
        !result.files
    ) {
        throw new Error(
            "Python engine returned an incomplete response.",
        );
    }


    // --------------------------------------------------------
    // Transform Python result
    // --------------------------------------------------------

    return {
        success: true,

        totalParts:
            result.totalParts,

        secretMessageLength:
            result.secretMessageLength,

        files: result.files.map(
            (file) => ({
                ...file,

                downloadUrl:
                    `/api/download/${encodeURIComponent(
                        file.outputFile,
                    )}`,
            }),
        ),
    };
};