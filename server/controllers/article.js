const Article = require('../models/article');
const path = require('path');
const fs = require('fs').promises;

exports.getArticleById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const article = await Article.findByPk(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving article', error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, summary } = req.body;
    const userId = req.user.id;
    
    try {
        const article = await Article.findByPk(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        if (article.authorId !== userId) {
            return res.status(403).json({ message: 'Only the author can update this article' });
        }
        
        if (title !== undefined) article.title = title;
        if (summary !== undefined) article.summary = summary;
        
        await article.save();
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error updating article', error: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    try {
        const article = await Article.findByPk(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        if (article.authorId !== userId) {
            return res.status(403).json({ message: 'Only the author can delete this article' });
        }
        
        try {
            await fs.unlink(article.pdfPath);
        } catch (err) {
            console.error('Error deleting PDF file:', err);
        }
        
        await article.destroy();
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article', error: error.message });
    }
};

exports.uploadArticle = async (req, res) => {
    const { conferenceId } = req.params;
    const { title, summary } = req.body;
    const authorId = req.user.id;
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }
        
        const pdfPath = req.file.path;
        
        const article = await Article.create({
            title,
            summary,
            pdfPath,
            authorId,
            conferenceId,
            status: 'under_review',
            currentVersion: 1
        });
        
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading article', error: error.message });
    }
};

exports.getArticlesAsAuthor = async (req, res) => {
    const { conferenceId } = req.params;
    const authorId = req.user.id;
    
    try {
        const articles = await Article.findAll({
            where: {
                conferenceId,
                authorId
            }
        });
        
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving articles', error: error.message });
    }
};

exports.getArticleVersions = async (req, res) => {
    const { articleId } = req.params;
    
    try {
        const article = await Article.findByPk(articleId);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        res.json({
            articleId: article.id,
            currentVersion: article.currentVersion,
            title: article.title,
            pdfPath: article.pdfPath
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving article versions', error: error.message });
    }
};

exports.uploadNewVersion = async (req, res) => {
    const { articleId } = req.params;
    const userId = req.user.id;
    
    try {
        const article = await Article.findByPk(articleId);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        if (article.authorId !== userId) {
            return res.status(403).json({ message: 'Only the author can upload new versions' });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        article.pdfPath = req.file.path;
        article.currentVersion += 1;
        
        await article.save();
        
        res.json({
            message: 'New version uploaded successfully',
            article
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading new version', error: error.message });
    }
};

exports.getArticlesForReview = async (req, res) => {
    const { conferenceId } = req.params;
    const reviewerId = req.user.id;
    
    try {
        const articles = await Article.findAll({
            where: {
                reviewerId,
                conferenceId
            }
        });
        
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving articles for review', error: error.message });
    }
};

exports.monitorArticles = async (req, res) => {
    const { conferenceId } = req.params;
    
    try {
        const articles = await Article.findAll({
            where: { conferenceId }
        });
        
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error monitoring articles', error: error.message });
    }
};

exports.submitReview = async (req, res) => {
    const { articleId } = req.params;
    const reviewerId = req.user.id;
    const { feedback, decision } = req.body;
    
    try {
        const article = await Article.findByPk(articleId);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        if (decision) {
            article.status = decision;
            await article.save();
        }
        
        res.status(200).json({
            message: 'Review submitted successfully',
            article
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
};

module.exports = exports;
