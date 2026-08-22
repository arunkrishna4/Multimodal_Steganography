# from pathlib import Path

# from stego_engine import run_embed, run_extract


# def main():

#     print("\n========== STEGOSHIELD ENGINE TEST ==========\n")

#     base_dir = Path(__file__).parent
#     output_dir = base_dir / "test_output"

#     output_dir.mkdir(exist_ok=True)

#     image_path = base_dir / "test_image.png"
#     audio_path = base_dir / "test_audio.wav"

#     secret_text = (
#         "This is a StegoShield test message. "
#         "The secret message will be split into two parts, "
#         "embedded into an image and an audio file, "
#         "then extracted and reconstructed."
#     )

#     print("Secret message:")
#     print(secret_text)
#     print("\nSecret length:", len(secret_text), "characters")

#     # NOTE: keys must be input_path / output_path to match run_embed()
#     media_files = [
#         {
#             "type": "image",
#             "input_path": str(image_path),
#             "output_path": str(output_dir / "stego_test_image.png"),
#         },
#         {
#             "type": "audio",
#             "input_path": str(audio_path),
#             "output_path": str(output_dir / "stego_test_audio.wav"),
#         },
#     ]

#     print("\n========== CHECKING INPUT FILES ==========\n")

#     for media in media_files:
#         path = Path(media["input_path"])
#         print(f'{media["type"].upper()}: {path}')
#         if not path.exists():
#             print("❌ FILE NOT FOUND")
#             return
#         print("✓ Found")

#     print("\n========== EMBEDDING ==========\n")

#     try:
#         embed_result = run_embed(
#             message=secret_text,
#             media_files=media_files,
#             output_dir=output_dir,
#         )

#         print("\nEmbedding successful!\n")
#         print("Total files:", embed_result["totalParts"])
#         print("\nEmbedding results:")

#         for result in embed_result["files"]:
#             print(f'\n  {result["mediaType"].upper()}')
#             print("  Sequence:", result["sequence"])
#             print("  Message length:", result["messageLength"], "characters")
#             print("  Input:", result["inputFile"])
#             print("  Output:", result["outputFile"])

#             # psnr/snr live directly on result, not under result["result"]
#             if result["mediaType"] == "image":
#                 print("  PSNR:", result.get("psnr", "N/A"), "dB")
#             elif result["mediaType"] == "audio":
#                 print("  SNR:", result.get("snr", "N/A"), "dB")

#     except Exception as e:
#         print("\n❌ EMBEDDING FAILED")
#         print(type(e).__name__, ":", e)
#         return

#     print("\n========== EXTRACTION ==========\n")

#     # NOTE: keys must be input_path to match run_extract()
#     extraction_files = [
#         {
#             "type": "image",
#             "input_path": str(output_dir / "stego_test_image.png"),
#         },
#         {
#             "type": "audio",
#             "input_path": str(output_dir / "stego_test_audio.wav"),
#         },
#     ]

#     try:
#         extract_result = run_extract(extraction_files)

#         print("\nExtraction successful!\n")
#         print("Total files:", extract_result["totalParts"])
#         print("\nExtracted message:")
#         print(extract_result["message"])

#         print("\n========== COMPARISON ==========\n")

#         extracted_message = extract_result["message"]

#         if extracted_message == secret_text:
#             print("✅ SUCCESS!")
#             print("Original and extracted messages MATCH.")
#         else:
#             print("❌ FAILED!")
#             print("Original and extracted messages DO NOT MATCH.")
#             print("\nOriginal:")
#             print(secret_text)
#             print("\nExtracted:")
#             print(extracted_message)

#     except Exception as e:
#         print("\n❌ EXTRACTION FAILED")
#         print(type(e).__name__, ":", e)
#         return

#     print("\n========== TEST COMPLETE ==========\n")


# if __name__ == "__main__":
#     main()