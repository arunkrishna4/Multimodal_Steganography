import sys
import json
import os

from common import text_to_binary, binary_to_text

from header import (
    create_message_with_header,
    SEQUENCE_BITS,
    MESSAGE_LENGTH_BITS,
    TOTAL_HEADER_BITS,
)

from split import split_text

from image_lsb import (
    embed_binary_in_image,
    extract_binary_from_image,
    calculate_psnr,
)

from audio_lsb import (
    embed_binary_in_audio,
    extract_binary_from_audio,
    calculate_snr,
)


# ============================================================
# EMBED
# ============================================================

def run_embed(message, media_files, output_dir):
    """
    Split the secret message according to the number of
    media files and embed each part into its corresponding
    media file.
    """

    if not message:
        raise ValueError("Secret message cannot be empty.")

    if not media_files:
        raise ValueError(
            "At least one media file is required."
        )

    os.makedirs(output_dir, exist_ok=True)

    # --------------------------------------------------------
    # STEP 1: Split secret message
    # --------------------------------------------------------

    parts = split_text(
        message,
        len(media_files),
    )

    results = []

    # --------------------------------------------------------
    # STEP 2: Embed each part
    # --------------------------------------------------------

    for index, media in enumerate(media_files):

        media_type = media["type"]

        # Your test/frontend should provide these keys
        input_path = media["input_path"]
        output_path = media["output_path"]

        message_part = parts[index]

        # ----------------------------------------------------
        # Convert text -> binary
        # ----------------------------------------------------

        binary_message = text_to_binary(
            message_part
        )

        # ----------------------------------------------------
        # Add sequence number + message length header
        # ----------------------------------------------------

        binary_with_header = create_message_with_header(
            binary_message,
            index,
        )

        # ====================================================
        # IMAGE
        # ====================================================

        if media_type == "image":

            stego_data, original_data = (
                embed_binary_in_image(
                    image_path=input_path,
                    full_binary_message_with_header=
                        binary_with_header,
                    output_path=output_path,
                )
            )

            psnr = calculate_psnr(
                original_data,
                stego_data,
            )

            results.append({
                "sequence": index,
                "mediaType": "image",
                "inputFile": os.path.basename(
                    input_path
                ),
                "outputFile": os.path.basename(
                    output_path
                ),
                "messageLength": len(message_part),
                "messageBits": len(binary_message),
                "headerBits": TOTAL_HEADER_BITS,
                "totalBits": len(binary_with_header),
                "psnr": psnr,
            })

        # ====================================================
        # AUDIO
        # ====================================================

        elif media_type == "audio":

            (
                stego_data,
                original_data,
                sample_rate,
            ) = embed_binary_in_audio(
                audio_path=input_path,
                full_binary_message_with_header=
                    binary_with_header,
                output_path=output_path,
            )

            snr = calculate_snr(
                original_data,
                stego_data,
            )

            results.append({
                "sequence": index,
                "mediaType": "audio",
                "inputFile": os.path.basename(
                    input_path
                ),
                "outputFile": os.path.basename(
                    output_path
                ),
                "messageLength": len(message_part),
                "messageBits": len(binary_message),
                "headerBits": TOTAL_HEADER_BITS,
                "totalBits": len(binary_with_header),
                "snr": snr,
                "sampleRate": sample_rate,
            })

        else:
            raise ValueError(
                f"Unsupported media type: {media_type}"
            )

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {
        "success": True,
        "totalParts": len(parts),
        "secretMessageLength": len(message),
        "files": results,
    }


# ============================================================
# EXTRACT
# ============================================================

def run_extract(media_files):
    """
    Extract hidden message parts from stego media files
    and reconstruct the original secret message using
    sequence numbers.
    """

    if not media_files:
        raise ValueError(
            "At least one stego media file is required."
        )

    extracted_parts = []

    # --------------------------------------------------------
    # Extract every media file
    # --------------------------------------------------------

    for media in media_files:

        media_type = media["type"]
        input_path = media["input_path"]

        # ====================================================
        # IMAGE
        # ====================================================

        if media_type == "image":

            (
                binary_message,
                sequence_number,
            ) = extract_binary_from_image(
                stego_image_path=input_path,
                total_header_bits=TOTAL_HEADER_BITS,
                sequence_bits=SEQUENCE_BITS,
                message_length_bits=MESSAGE_LENGTH_BITS,
            )

        # ====================================================
        # AUDIO
        # ====================================================

        elif media_type == "audio":

            (
                binary_message,
                sequence_number,
            ) = extract_binary_from_audio(
                stego_audio_path=input_path,
                total_header_bits=TOTAL_HEADER_BITS,
                sequence_bits=SEQUENCE_BITS,
                message_length_bits=MESSAGE_LENGTH_BITS,
            )

        else:
            raise ValueError(
                f"Unsupported media type: {media_type}"
            )

        # ----------------------------------------------------
        # Binary -> text
        # ----------------------------------------------------

        extracted_text = binary_to_text(
            binary_message
        )

        extracted_parts.append({
            "sequence": sequence_number,
            "mediaType": media_type,
            "file": os.path.basename(input_path),
            "message": extracted_text,
            "messageBits": len(binary_message),
        })

    # --------------------------------------------------------
    # Sort according to sequence number
    # --------------------------------------------------------

    extracted_parts.sort(
        key=lambda item: item["sequence"]
    )

    # --------------------------------------------------------
    # Reconstruct original message
    # --------------------------------------------------------

    reconstructed_message = "".join(
        item["message"]
        for item in extracted_parts
    )

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {
        "success": True,
        "totalParts": len(extracted_parts),
        "message": reconstructed_message,
        "parts": [
            {
                "sequence": item["sequence"],
                "mediaType": item["mediaType"],
                "file": item["file"],
                "messageBits": item["messageBits"],
            }
            for item in extracted_parts
        ],
    }


# ============================================================
# COMMAND LINE ENTRY POINT
# ============================================================

def main():

    if len(sys.argv) < 2:

        print(json.dumps({
            "success": False,
            "error": "No operation specified."
        }))

        sys.exit(1)

    operation = sys.argv[1]

    try:

        # ====================================================
        # EMBED
        # ====================================================

        if operation == "embed":

            if len(sys.argv) < 3:
                raise ValueError(
                    "Missing embed configuration."
                )

            config = json.loads(
                sys.argv[2]
            )

            message = config["message"]

            media_files = config["mediaFiles"]

            output_dir = config["outputDir"]

            result = run_embed(
                message,
                media_files,
                output_dir,
            )

        # ====================================================
        # EXTRACT
        # ====================================================

        elif operation == "extract":

            if len(sys.argv) < 3:
                raise ValueError(
                    "Missing extract configuration."
                )

            config = json.loads(
                sys.argv[2]
            )

            media_files = config["mediaFiles"]

            result = run_extract(
                media_files
            )

        else:

            raise ValueError(
                f"Unknown operation: {operation}"
            )

        print(
            json.dumps(
                result,
                ensure_ascii=False
            )
        )

    except Exception as error:

        print(
            json.dumps({
                "success": False,
                "error": str(error),
            })
        )

        sys.exit(1)


if __name__ == "__main__":
    main()