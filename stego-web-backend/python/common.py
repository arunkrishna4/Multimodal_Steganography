def text_to_binary(text):
    """Convert UTF-8 text into a binary string."""
    byte_message = text.encode("utf-8")
    return "".join(format(byte, "08b") for byte in byte_message)


def binary_to_text(binary_string):
    """Convert a binary string back into UTF-8 text."""
    byte_list = []

    for i in range(0, len(binary_string), 8):
        byte_chunk = binary_string[i:i + 8]

        if len(byte_chunk) == 8:
            byte_list.append(int(byte_chunk, 2))

    return bytes(byte_list).decode("utf-8", errors="replace")


def int_to_fixed_binary(integer, num_bits):
    """Convert an integer into a fixed-length binary string."""
    if integer < 0 or integer >= (1 << num_bits):
        raise ValueError(
            f"Integer {integer} out of range for {num_bits} bits."
        )

    return format(integer, f"0{num_bits}b")


def fixed_binary_to_int(binary_string):
    """Convert a binary string into an integer."""
    return int(binary_string, 2)