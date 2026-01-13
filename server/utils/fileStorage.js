const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

function saveBase64Pdf(base64, fileName = "paper.pdf") {
  ensureUploadDir();

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const finalName = `${Date.now()}_${safeName}`;
  const filePath = path.join(uploadDir, finalName);

  const data = base64.includes("base64,")
    ? base64.split("base64,")[1]
    : base64;

  fs.writeFileSync(filePath, Buffer.from(data, "base64"));

  return {
    pdfPath: filePath,
    pdfUrl: `/uploads/${finalName}`,
  };
}

module.exports = { saveBase64Pdf };
