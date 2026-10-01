import numpy as np
from PIL import Image

from common import fixed_binary_to_int


# ============================================================
# METHOD HELPERS
# ============================================================

def get_method_bits(method):
    

    methods = {
        "lsb-substitution": [0],
        "5-lsb-substitution": [4],
        "6-lsb-substitution": [5],
        "5&6-lsb-substitution": [4, 5],
    }

    if method not in methods:
        raise ValueError(
            f"Unsupported image steganography method: {method}"
        )

    return methods[method]


def get_image_capacity(image_data, method):
    """
    Return the number of bits that can be stored in the image
    using the selected method.
    """

    rows, cols = image_data.shape

    bits_per_pixel = len(get_method_bits(method))

    return rows * cols * bits_per_pixel


# ============================================================
# EMBED
# ============================================================

def embed_binary_in_image(
    image_path,
    full_binary_message_with_header,
    output_path,
    method="lsb-substitution",
):
    """
    Embed a binary message into a grayscale image using
    the selected steganography method.
    """

    with Image.open(image_path) as img:
        original_image_data = np.array(
            img.convert("L"),
            dtype=np.uint8,
        )

    bit_positions = get_method_bits(method)

    capacity = get_image_capacity(
        original_image_data,
        method,
    )

    if len(full_binary_message_with_header) > capacity:
        raise ValueError(
            f"Message (including header) is too long for this image "
            f"using {method}. "
            f"Capacity: {capacity} bits, "
            f"required: {len(full_binary_message_with_header)} bits."
        )

    stego_image_data = np.copy(original_image_data)

    message_index = 0

    rows, cols = stego_image_data.shape

    for r in range(rows):
        for c in range(cols):

            if message_index >= len(
                full_binary_message_with_header
            ):
                break

            pixel_value = int(
                stego_image_data[r, c]
            )

            # ------------------------------------------------
            # Embed one or more bits into this pixel
            # ------------------------------------------------

            for bit_position in bit_positions:

                if message_index >= len(
                    full_binary_message_with_header
                ):
                    break

                message_bit = int(
                    full_binary_message_with_header[
                        message_index
                    ]
                )

                # Clear the selected bit.
                pixel_value &= ~(1 << bit_position)

                # Insert the message bit.
                pixel_value |= (
                    message_bit << bit_position
                )

                message_index += 1

            stego_image_data[r, c] = pixel_value

        if message_index >= len(
            full_binary_message_with_header
        ):
            break

    stego_img = Image.fromarray(
        stego_image_data.astype(np.uint8)
    )

    stego_img.save(output_path)

    return stego_image_data, original_image_data


# ============================================================
# EXTRACT
# ============================================================

def extract_binary_from_image(
    stego_image_path,
    total_header_bits,
    sequence_bits,
    message_length_bits,
    method="lsb-substitution",
):
    """
    Extract the binary message from an image using the
    selected steganography method.
    """

    stego_img = Image.open(
        stego_image_path
    ).convert("L")

    stego_image_data = np.array(stego_img)

    rows, cols = stego_image_data.shape

    bit_positions = get_method_bits(method)

    total_capacity = (
        rows
        * cols
        * len(bit_positions)
    )

    if total_capacity < total_header_bits:
        raise ValueError(
            "Image is too small to contain message metadata."
        )

    # ========================================================
    # Extract header
    # ========================================================

    full_binary_header = ""

    message_bit_index = 0

    for r in range(rows):
        for c in range(cols):

            if message_bit_index >= total_header_bits:
                break

            pixel_value = int(
                stego_image_data[r, c]
            )

            for bit_position in bit_positions:

                if message_bit_index >= total_header_bits:
                    break

                bit = (
                    pixel_value >> bit_position
                ) & 1

                full_binary_header += str(bit)

                message_bit_index += 1

        if message_bit_index >= total_header_bits:
            break

    # ========================================================
    # Parse header
    # ========================================================

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

    # ========================================================
    # Validate capacity
    # ========================================================

    required_bits = (
        total_header_bits
        + message_length
    )

    if total_capacity < required_bits:
        raise ValueError(
            "Image does not contain the full message "
            "indicated by the header."
        )

    # ========================================================
    # Extract payload
    # ========================================================

    extracted_binary_message = ""

    message_bit_index = 0

    for r in range(rows):
        for c in range(cols):

            pixel_value = int(
                stego_image_data[r, c]
            )

            for bit_position in bit_positions:

                if message_bit_index < total_header_bits:
                    message_bit_index += 1
                    continue

                if message_bit_index >= required_bits:
                    break

                bit = (
                    pixel_value >> bit_position
                ) & 1

                extracted_binary_message += str(bit)

                message_bit_index += 1

            if message_bit_index >= required_bits:
                break

        if message_bit_index >= required_bits:
            break

    return (
        extracted_binary_message,
        sequence_number,
    )


# ============================================================
# PSNR
# ============================================================

def calculate_psnr(original_image, stego_image):
    """Calculate PSNR in dB."""

    mse = np.mean(
        (original_image.astype(np.float64)
         - stego_image.astype(np.float64)) ** 2
    )

    if mse == 0:
        return float("inf")

    max_pixel = 255.0

    return 20 * np.log10(
        max_pixel / np.sqrt(mse)
    )