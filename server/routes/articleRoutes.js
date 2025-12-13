const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleControllers');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/articles/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/articles/:id', 
    articleController.getArticleById
);

router.patch('/articles/:id', 
    articleController.updateArticle
);

router.delete('/articles/:id', 
    articleController.deleteArticle
);

router.post('/conferences/:conferenceId/articles', 
    upload.single('pdf'),
    articleController.uploadArticle
);

router.get('/conferences/:conferenceId/articles/as-author', 
    articleController.getArticlesAsAuthor
);

router.get('/articles/:articleId/versions', 
    articleController.getArticleVersions
);

router.post('/articles/:articleId/versions', 
    upload.single('pdf'),
    articleController.uploadNewVersion
);

router.get('/conferences/:conferenceId/articles/review', 
    articleController.getArticlesForReview
);

router.get('/conferences/:conferenceId/articles/monitor', 
    articleController.monitorArticles
);

router.post('/articles/:articleId/review', 
    articleController.submitReview
);

module.exports = router;
