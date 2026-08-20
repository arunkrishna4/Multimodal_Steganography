def split_text(text, number_of_parts):
    """
    Split text into approximately equal parts.

    Example:
        split_text("ABCDEFGH", 2)
        -> ["ABCD", "EFGH"]

        split_text("ABCDEFGH", 4)
        -> ["AB", "CD", "EF", "GH"]
    """

    if number_of_parts <= 0:
        raise ValueError("Number of parts must be greater than zero.")

    if not text:
        raise ValueError("Text cannot be empty.")

    if number_of_parts > len(text):
        raise ValueError(
            "Number of parts cannot be greater than the text length."
        )

    base_size = len(text) // number_of_parts
    remainder = len(text) % number_of_parts

    parts = []
    start = 0

    for i in range(number_of_parts):
        # First `remainder` parts get one extra character.
        current_size = base_size + (1 if i < remainder else 0)

        end = start + current_size
        parts.append(text[start:end])

        start = end

    return parts
