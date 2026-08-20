import numpy as np
from scipy.io import wavfile

from common import fixed_binary_to_int


def embed_binary_in_audio(
    audio_path,
    full_binary_message_with_header,
    output_path,
):
    """
    Embed a binary message into the LSB of an audio file.
    """

    sample_rate, audio_data = wavfile.read(audio_path)

    if audio_data.ndim > 1:
        audio_data = audio_data.flatten()

    original_audio_for_snr = audio_data.astype(np.float64)

    processing_audio_data = audio_data.astype(np.int32)

    if len(full_binary_message_with_header) > len(
        processing_audio_data
    ):
        raise ValueError(
            "Message (including header) is too long "
            "to embed in this audio file."
        )

    stego_audio_data = np.copy(
        processing_audio_data
    )

    for i in range(
        len(full_binary_message_with_header)
    ):
        bit = int(
            full_binary_message_with_header[i]
        )

        stego_audio_data[i] = (
            stego_audio_data[i] & 0xFFFE
        ) | bit

    stego_audio_data_final = (
        stego_audio_data.astype(np.int16)
    )

    wavfile.write(
        output_path,
        sample_rate,
        stego_audio_data_final,
    )

    return (
        stego_audio_data_final,
        original_audio_for_snr,
        sample_rate,
    )


def extract_binary_from_audio(
    stego_audio_path,
    total_header_bits,
    sequence_bits,
    message_length_bits,
):
    """
    Extract binary message and sequence number
    from a stego audio file.
    """

    sample_rate, stego_audio_data = wavfile.read(
        stego_audio_path
    )

    if stego_audio_data.ndim > 1:
        stego_audio_data = (
            stego_audio_data.flatten()
        )

    if len(stego_audio_data) < total_header_bits:
        raise ValueError(
            "Audio file is too short to contain "
            "message metadata."
        )

    full_binary_header = ""

    for i in range(total_header_bits):
        full_binary_header += str(
            stego_audio_data[i] & 1
        )

    sequence_binary_string = (
        full_binary_header[:sequence_bits]
    )

    length_binary_string = (
        full_binary_header[
            sequence_bits:
            sequence_bits + message_length_bits
        ]
    )

    sequence_number = fixed_binary_to_int(
        sequence_binary_string
    )

    message_length = fixed_binary_to_int(
        length_binary_string
    )

    start_index = total_header_bits

    if len(stego_audio_data) < (
        start_index + message_length
    ):
        raise ValueError(
            "Audio file does not contain the "
            "full message indicated by the header."
        )

    extracted_binary_message = ""

    for i in range(
        start_index,
        start_index + message_length,
    ):
        extracted_binary_message += str(
            stego_audio_data[i] & 1
        )

    return (
        extracted_binary_message,
        sequence_number,
    )


def calculate_snr(
    original_signal,
    stego_signal,
):
    """Calculate Signal-to-Noise Ratio in dB."""

    original_signal = (
        original_signal.astype(np.float64)
    )

    stego_signal = (
        stego_signal.astype(np.float64)
    )

    signal_power = np.sum(
        original_signal ** 2
    )

    noise = (
        original_signal - stego_signal
    )

    noise_power = np.sum(
        noise ** 2
    )

    if noise_power == 0:
        return float("inf")

    return 10 * np.log10(
        signal_power / noise_power
    )