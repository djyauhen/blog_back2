const express = require('express');
const ArticleController = require('../controllers/articles.controller');
const multer = require("multer");
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.toLowerCase());
    }
});


const upload = multer({storage: storage});

// Get All Operations
router.get('/', ArticleController.getArticles);
router.get('/:id', ArticleController.getArticle);
router.post('/',
    // Применяем Multer только при наличии загруженного файла
    upload.single('image'),
    (req, res, next) => ArticleController.addArticle(req,  res));
router.delete('/:id', ArticleController.deleteArticle);
router.put('/:id',
    // Применяем Multer только при наличии загруженного файла
    upload.single('image'),
    (req, res, next) => ArticleController.updateArticle(req,  res));
module.exports = router;