import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";

import type {
    SplitEmbedResult,
    SplitEmbedResponse,
} from "../types/split-and-embed.types";

interface PythonMediaFile {
    type: "image" | "audio";
    input_path: string;
    output_path: string;
}

interface PythonEmbedConfig {
    message: string;
    mediaFiles: PythonMediaFile[];
    outputDir: string;
}

const runPythonEngine = (
    operation: "embed" | "extract",
    config: PythonEmbedConfig,
): Promise<SplitEmbedResponse> => {
    return new Promise(async (resolve, reject) => {

        try {

            const pythonScript = path.resolve(
                process.cwd(),
                "python",
                "stego_engine.py",
            );

            const tempDir = path.resolve(
                process.cwd(),
                "temp",
            );

            await fs.mkdir(tempDir, {
                recursive: true,
            });

            const configPath = path.join(
                tempDir,
                `stego-config-${Date.now()}.json`,
            );

            await fs.writeFile(
                configPath,
                JSON.stringify(config),
                "utf-8",
            );

            const pythonProcess = spawn(
                "python",
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

            pythonProcess.stdout.on("data", (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                stderr += data.toString();
            });

            pythonProcess.on("error", async (error) => {

                await fs.unlink(configPath).catch(() => { });

                reject(
                    new Error(
                        `Failed to start Python engine: ${error.message}`,
                    ),
                );
            });

            pythonProcess.on("close", async (code) => {

                await fs.unlink(configPath).catch(() => { });

                if (code !== 0) {

                    reject(
                        new Error(
                            stderr ||
                            stdout ||
                            `Python engine exited with code ${code}`,
                        ),
                    );

                    return;
                }

                try {

                    const result = JSON.parse(stdout);

                    resolve(result);

                } catch {

                    reject(
                        new Error(
                            "Python engine returned an invalid response.",
                        ),
                    );
                }
            });

        } catch (error) {

            reject(error);
        }
    });
};


/**
 * Split the secret message and embed it into
 * the supplied media files.
 */
export const splitAndEmbed = async (
    message: string,
    mediaFiles: PythonMediaFile[],
    outputDir: string,
): Promise<SplitEmbedResult> => {
    if (!message.trim()) {
        throw new Error(
            "Secret message cannot be empty.",
        );
    }

    if (!mediaFiles.length) {
        throw new Error(
            "At least one media file is required.",
        );
    }

    const config: PythonEmbedConfig = {
        message,
        mediaFiles,
        outputDir,
    };

    const result = await runPythonEngine(
        "embed",
        config,
    );

    if (!result.success) {
        throw new Error(result.error);
    }

    return result;
};