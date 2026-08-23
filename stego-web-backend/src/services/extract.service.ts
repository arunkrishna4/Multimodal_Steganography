import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";

import type {
    ExtractResponseResult,
} from "../types/extract.types";


interface PythonMediaFile {
    type: "image" | "audio";
    input_path: string;
}


interface PythonExtractConfig {
    mediaFiles: PythonMediaFile[];
}


interface PythonExtractSuccess {
    success: true;
    totalParts: number;
    message: string;
    parts: {
        sequence: number;
        mediaType: string;
        file: string;
        messageBits: number;
    }[];
}


interface PythonExtractError {
    success: false;
    error: string;
}


type PythonExtractResult =
    | PythonExtractSuccess
    | PythonExtractError;


// ============================================================
// RUN PYTHON ENGINE
// ============================================================

const runPythonEngine = (
    config: PythonExtractConfig,
): Promise<PythonExtractResult> => {

    return new Promise(async (resolve, reject) => {

        try {

            // --------------------------------------------------
            // 1. Locate Python engine
            // --------------------------------------------------

            const pythonEnginePath = path.resolve(
                process.cwd(),
                "python",
                "stego_engine.py",
            );


            // --------------------------------------------------
            // 2. Create output directory
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
            // 3. Create configuration file
            // --------------------------------------------------

            const configPath = path.resolve(
                outputDir,
                "extract_config.json",
            );

            await fs.writeFile(
                configPath,
                JSON.stringify(config),
                "utf-8",
            );


            // --------------------------------------------------
            // 4. Spawn Python process
            // --------------------------------------------------

            const pythonProcess = spawn(
                "python",
                [
                    pythonEnginePath,
                    "extract",
                    configPath,
                ],
                {
                    cwd: process.cwd(),
                },
            );


            // --------------------------------------------------
            // 5. Collect stdout
            // --------------------------------------------------

            let stdout = "";

            pythonProcess.stdout.on(
                "data",
                (data) => {
                    stdout += data.toString();
                },
            );


            // --------------------------------------------------
            // 6. Collect stderr
            // --------------------------------------------------

            let stderr = "";

            pythonProcess.stderr.on(
                "data",
                (data) => {
                    stderr += data.toString();
                },
            );


            // --------------------------------------------------
            // 7. Handle process error
            // --------------------------------------------------

            pythonProcess.on(
                "error",
                (error) => {
                    reject(
                        new Error(
                            `Failed to start Python engine: ${error.message}`,
                        ),
                    );
                },
            );


            // --------------------------------------------------
            // 8. Handle Python process completion
            // --------------------------------------------------

            pythonProcess.on(
                "close",
                (code) => {

                    if (code !== 0) {

                        reject(
                            new Error(
                                stderr ||
                                stdout ||
                                `Python process exited with code ${code}.`,
                            ),
                        );

                        return;
                    }


                    // ------------------------------------------
                    // Parse Python JSON response
                    // ------------------------------------------

                    try {

                        const result =
                            JSON.parse(stdout) as PythonExtractResult;

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
// EXTRACT MESSAGE
// ============================================================

export const extractMessage = async (
    mediaFiles: PythonMediaFile[],
): Promise<ExtractResponseResult> => {

    // --------------------------------------------------------
    // 1. Validate media files
    // --------------------------------------------------------

    if (
        !mediaFiles ||
        mediaFiles.length === 0
    ) {
        throw new Error(
            "No media files provided.",
        );
    }


    // --------------------------------------------------------
    // 2. Create Python configuration
    // --------------------------------------------------------

    const config: PythonExtractConfig = {
        mediaFiles,
    };


    // --------------------------------------------------------
    // 3. Run Python engine
    // --------------------------------------------------------

    const pythonResult =
        await runPythonEngine(config);


    // --------------------------------------------------------
    // 4. Check Python result
    // --------------------------------------------------------

    if (!pythonResult.success) {

        throw new Error(
            pythonResult.error ||
            "Python engine failed to extract message.",
        );
    }


    // --------------------------------------------------------
    // 5. Transform Python result
    //    into frontend response
    // --------------------------------------------------------

    const extractedMessage = pythonResult.message
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();

    return {
        mediaFiles: pythonResult.totalParts,
        messageLength: extractedMessage.length,
        extractedMessage,
    };
};