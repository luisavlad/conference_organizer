const Conference = require('../models/conference');
const Article = require('../models/article');

exports.createConference = async (req, res) => {
    const { title, description, location, startDate, endDate, submissionStart, submissionEnd } = req.body;
    const createdBy = req.user.id; 

    try {
        const conference = await Conference.create({
            title,
            description,
            location,
            startDate,
            endDate,
            submissionStart,
            submissionEnd,
            createdBy
        });
        res.status(201).json(conference);
    } catch (error) {
        res.status(500).json({ message: 'Error creating conference', error: error.message });
    }
};

exports.getAllConferences = async (req, res) => {
    try {
        const conferences = await Conference.findAll(); 
        res.json(conferences);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving conferences', error: error.message });
    }
};

exports.getConferenceById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const conference = await Conference.findByPk(id);
        
        if (!conference) {
            return res.status(404).json({ message: 'Conference not found' });
        }
        
        res.json(conference);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving conference', error: error.message });
    }
};

exports.getConferencesAsAuthor = async (req, res) => {
    const authorId = req.user.id;
    
    try {
        const articles = await Article.findAll({
            where: { authorId },
            attributes: ['conferenceId'],
            group: ['conferenceId']
        });
        
        const conferenceIds = articles.map(article => article.conferenceId);
        
        const conferences = await Conference.findAll({
            where: {
                id: conferenceIds
            }
        });
        
        res.json(conferences);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving author conferences', error: error.message });
    }
};

exports.getConferencesAsReviewer = async (req, res) => {
    const reviewerId = req.user.id;
    
    try {
        const articles = await Article.findAll({
            where: { reviewerId },
            attributes: ['conferenceId'],
            group: ['conferenceId']
        });
        
        const conferenceIds = articles.map(article => article.conferenceId);
        
        const conferences = await Conference.findAll({
            where: {
                id: conferenceIds
            }
        }); 
        res.json(conferences);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reviewer conferences', error: error.message });
    }
};

exports.deleteConference = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    try {
        const conference = await Conference.findByPk(id);
        
        if (!conference) {
            return res.status(404).json({ message: 'Conference not found' });
        }
        
        if (conference.createdBy !== userId) {
            return res.status(403).json({ message: 'Only the conference creator can delete it' });
        }
        
        await conference.destroy();
        res.status(200).json({ message: 'Conference deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting conference', error: error.message });
    }
};

exports.allocateReviewers = async (req, res) => {
    const conferenceId = req.params.id;
    const { articleId, reviewerId } = req.body; 

    try {
        if (articleId && reviewerId) {
            const article = await Article.findByPk(articleId);
            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            article.reviewerId = reviewerId;
            await article.save();
            return res.status(200).json({ message: 'Reviewer allocated successfully' });
        }
        
        const sequelize = require('../config/sequelize');
        const { QueryTypes } = require('sequelize');
        
        const unassignedArticles = await Article.findAll({
            where: {
                conferenceId,
                reviewerId: null
            }
        });
        
        if (unassignedArticles.length === 0) {
            return res.status(200).json({ message: 'No unassigned articles found' });
        }
        
        const availableReviewer = await sequelize.query(
            `SELECT id FROM Users WHERE isAvailable = 1 AND role = 'reviewer' LIMIT 1`,
            { type: QueryTypes.SELECT }
        );
        
        if (!availableReviewer || availableReviewer.length === 0) {
            return res.status(404).json({ message: 'No available reviewers found' });
        }
        
        const reviewerIdToAssign = availableReviewer[0].id;
        
        for (const article of unassignedArticles) {
            article.reviewerId = reviewerIdToAssign;
            await article.save();
        }
        
        res.status(200).json({ 
            message: 'Reviewers allocated successfully',
            allocatedArticles: unassignedArticles.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error allocating reviewers', error: error.message });
    }
};