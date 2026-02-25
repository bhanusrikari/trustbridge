const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl, filename: req.file.filename });
});

module.exports = router;
