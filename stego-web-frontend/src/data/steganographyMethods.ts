import type { MediaOption } from "../types/steganography";

export const STEGANOGRAPHY_MEDIA: MediaOption[] = [
  {
    type: "image",
    label: "Image",
    description: "Hide data inside a photo",
    icon: "image",
    methods: [
      {
        id: "lsb-substitution",
        name: "LSB Substitution",
        description:
          "Hide information by modifying the least significant bits.",
      },
    ],
  },

  {
    type: "video",
    label: "Video",
    description: "Hide data inside a video clip",
    icon: "video",
    methods: [
      {
        id: "video-lsb",
        name: "Video LSB",
        description: "Hide information inside selected video frames.",
      },
    ],
  },

  {
    type: "audio",
    label: "Audio",
    description: "Hide data inside a sound file",
    icon: "audio",
    methods: [
      {
        id: "audio-lsb",
        name: "Audio LSB",
        description: "Hide information inside audio sample bits.",
      },
    ],
  },

  {
    type: "text",
    label: "Text File",
    description: "Hide data inside a text document",
    icon: "text",
    methods: [
      {
        id: "whitespace",
        name: "Whitespace Steganography",
        description: "Hide information using whitespace patterns.",
      },
    ],
  },
];
