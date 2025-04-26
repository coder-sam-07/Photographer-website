const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  
  // Add new image to portfolio.json
  const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf-8'));
  data.images.push(filePath);
  fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));

  res.json({ message: 'Image uploaded successfully!' });
});

app.get('/portfolio-images', (req, res) => {
  const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf-8'));
  res.json(data);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

