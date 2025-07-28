// server.js (or server.jsx)
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// Set upload path to Render-safe directory
const uploadPath = '/tmp/uploads';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Serve uploaded files
app.use('/uploads', express.static(uploadPath));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

// List uploaded files
app.get('/files', (req, res) => {
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading files');
    }
    res.json(files);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
