const express = require('express');
const router = express.Router();
const conferenceController = require('../controllers/conference');

router.post('/', 
    conferenceController.createConference
);

router.get('/', 
    conferenceController.getAllConferences
);

router.get('/as-author', 
    conferenceController.getConferencesAsAuthor
);

router.get('/as-reviewer', 
    conferenceController.getConferencesAsReviewer
);

router.get('/:id', 
    conferenceController.getConferenceById
);

router.delete('/:id', 
    conferenceController.deleteConference
);

router.post('/:id/reviewers', 
    conferenceController.allocateReviewers
);

module.exports = router;
