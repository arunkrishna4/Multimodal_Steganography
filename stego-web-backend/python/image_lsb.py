import numpy as np
from PIL import Image

from common import fixed_binary_to_int


def embed_binary_in_image(
    image_path,
    full_binary_message_with_header,
    output_path,
):
    """
    Embed a binary message into the LSB of a grayscale image.
    """

    img = Image.open(image_path).convert("L")

    original_image_data = np.array(img)

    rows, cols = original_image_data.shape
    capacity = rows * cols

    if len(full_binary_message_with_header) > capacity:
        raise ValueError(
            "Message (including header) is too long to embed in this image."
        )

    stego_image_data = np.copy(original_image_data)

    message_index = 0

    for r in range(rows):
        for c in range(cols):

            if message_index < len(full_binary_message_with_header):

                bit = int(full_binary_message_with_header[message_index])

                stego_image_data[r, c] = (
                    stego_image_data[r, c] & 0xFE
                ) | bit

                message_index += 1

            else:
                break

        if message_index >= len(full_binary_message_with_header):
            break

    stego_img = Image.fromarray(
        stego_image_data.astype(np.uint8)
    )

    stego_img.save(output_path)

    return stego_image_data, original_image_data


def extract_binary_from_image(
    stego_image_path,
    total_header_bits,
    sequence_bits,
    message_length_bits,
):
    """
    Extract the binary message and sequence number from an image.
    """

    stego_img = Image.open(stego_image_path).convert("L")

    stego_image_data = np.array(stego_img)

    rows, cols = stego_image_data.shape

    total_pixels = rows * cols

    if total_pixels < total_header_bits:
        raise ValueError(
            "Image is too small to contain message metadata."
        )

    # Extract header
    full_binary_header = ""

    pixel_index = 0

    for r in range(rows):
        for c in range(cols):

            if pixel_index < total_header_bits:

                full_binary_header += str(
                    stego_image_data[r, c] & 1
                )

                pixel_index += 1

            else:
                break

        if pixel_index >= total_header_bits:
            break

    sequence_binary_string = full_binary_header[
        0:sequence_bits
    ]

    length_binary_string = full_binary_header[
        sequence_bits:
        sequence_bits + message_length_bits
    ]

    sequence_number = fixed_binary_to_int(
        sequence_binary_string
    )

    message_length = fixed_binary_to_int(
        length_binary_string
    )

    start_pixel_index = total_header_bits

    if total_pixels < start_pixel_index + message_length:
        raise ValueError(
            "Image does not contain the full message "
            "indicated by the header."
        )

    extracted_binary_message = ""

    current_pixel_index = 0

    for r in range(rows):
        for c in range(cols):

            if (
                current_pixel_index >= start_pixel_index
                and current_pixel_index
                < start_pixel_index + message_length
            ):
                extracted_binary_message += str(
                    stego_image_data[r, c] & 1
                )

            current_pixel_index += 1

            if (
                current_pixel_index
                >= start_pixel_index + message_length
            ):
                break

        if (
            current_pixel_index
            >= start_pixel_index + message_length
        ):
            break

    return extracted_binary_message, sequence_number


def calculate_psnr(original_image, stego_image):
    """Calculate PSNR in dB."""

    mse = np.mean(
        (original_image - stego_image) ** 2
    )

    if mse == 0:
        return float("inf")

    max_pixel = 255.0

    return 20 * np.log10(
        max_pixel / np.sqrt(mse)
    )