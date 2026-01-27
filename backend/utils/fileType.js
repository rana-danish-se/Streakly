const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const getResourceType = (mimeType) => {
  const normalizedMime = mimeType.toLowerCase();
  if (IMAGE_TYPES.includes(normalizedMime)) return "image";
  if (DOC_TYPES.includes(normalizedMime)) return "raw";
  throw new Error(`Unsupported file type: ${mimeType}`);
};
