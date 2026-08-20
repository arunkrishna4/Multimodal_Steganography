from common import int_to_fixed_binary


# 8 bits allows sequence numbers from 0 to 255.
SEQUENCE_BITS = 8

# 24 bits allows a message size of up to
# 16,777,215 bits.
MESSAGE_LENGTH_BITS = 24

TOTAL_HEADER_BITS = (
    SEQUENCE_BITS + MESSAGE_LENGTH_BITS
)


def create_message_with_header(
    binary_message,
    sequence_number,
):
    """
    Add sequence number and message length
    metadata before the binary message.
    """

    sequence_header = int_to_fixed_binary(
        sequence_number,
        SEQUENCE_BITS,
    )

    message_length_header = int_to_fixed_binary(
        len(binary_message),
        MESSAGE_LENGTH_BITS,
    )

    return (
        sequence_header
        + message_length_header
        + binary_message
    )