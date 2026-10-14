const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 8,
    parts: 9,
    fieldSize: 20000
  }
}).single("proposal");

function proposalUpload(req, res, next) {
  upload(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "The PDF must be 5 MB or smaller"
            : "Upload one PDF and check your event details"
      });
    }

    if (req.file) {
      const isPdfName = /\.pdf$/i.test(req.file.originalname);
      const hasPdfHeader =
        req.file.buffer.subarray(0, 5).toString("ascii") === "%PDF-";

      if (!isPdfName || !hasPdfHeader) {
        return res.status(400).json({
          message: "Please attach a PDF document"
        });
      }
    }

    next();
  });
}

module.exports = proposalUpload;