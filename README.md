Conference Organizer

Features
- User authentication (Authors, Reviewers, Organizers)
- Conference management
- Article submission and versioning
- Review system
- Comment system with visibility controls
- Automatic reviewer allocation

Tech Stack
- Node.js
- Express.js
- Sequelize ORM
- SQLite
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

Installation
1. Navigate to the server directory: cd server

2. Install dependencies: npm install

Running the Application

1. Development Mode (with auto-restart): npm run dev

2. Production Mode: npm start

The server will start on http://localhost:3000

Endpoints
Users
- POST /api/users/register - Register new user
- POST /api/users/login - User login
- GET /api/users/me - Get current user profile
- PATCH /api/users/me - Update current user
- GET /api/users - List all users (Organizers only)

Conferences
- POST /api/conferences - Create conference
- GET /api/conferences - Get all conferences
- GET /api/conferences/:id - Get conference by ID
- GET /api/conferences/as-author - Get conferences where user is author
- GET /api/conferences/as-reviewer - Get conferences where user is reviewer
- DELETE /api/conferences/:id - Delete conference
- POST /api/conferences/:id/reviewers - Allocate reviewers

Articles
- POST /api/conferences/:conferenceId/articles - Upload article
- GET /api/articles/:id - Get article by ID
- PATCH /api/articles/:id - Update article
- DELETE /api/articles/:id - Delete article
- GET /api/conferences/:conferenceId/articles/as-author - Get articles as author
- GET /api/conferences/:conferenceId/articles/review - Get articles for review
- GET /api/conferences/:conferenceId/articles/monitor - Monitor articles
- GET /api/articles/:articleId/versions - Get article versions
- POST /api/articles/:articleId/versions - Upload new version
- POST /api/articles/:articleId/review - Submit review

Reviews
- POST /api/articles/:articleId/reviews - Create review

Comments
- POST /api/reviews/:reviewId/comments - Create comment
- GET /api/reviews/:reviewId/comments - Get comments by review
- DELETE /api/comments/:id - Delete comment (Organizers only)

Authentication

Most endpoints require authentication. The JWT token can be included in the Authorization header: Bearer <jwt-token>


Project Structure

server/
-  config/          Database configuration
- controllers/     Request handlers
- core/            App and server setup
- middleware/      Authentication middleware
- models/          Sequelize models
- routes/          API routes
- sqlite/          SQLite database files
- uploads/         Uploaded article files

Database

The application uses SQLite. The database will be created automatically on first run.

User Roles
- Author: Can submit and manage their articles
- Reviewer: Can review assigned articles
- Organizer: Has full access to manage conferences, allocate reviewers, and moderate other users' activity
