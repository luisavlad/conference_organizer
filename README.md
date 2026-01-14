# Conference Organizer

A full-stack web application for managing academic conferences, article submissions, and peer reviews

## Features

- Conference management and creation
- Article submission with PDF upload
- Article versioning system
- PDF viewer for submitted articles
- Review comment system with visibility controls (public/internal)
- Automatic reviewer allocation (2 reviewers per article)
- Conference reviewer assignment (3 reviewers per conference)
- User role-based access control
- Preview mode to test different user perspectives

## Tech Stack

### Frontend
- React
- React Router for navigation
- Vite for build tooling
- React-PDF for PDF viewing
- Axios for API requests
- CSS Modules for styling

### Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL (production) / SQLite (development)
- Multer for file uploads

## Installation

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```
DATABASE_URL=your_postgresql_url (optional, uses SQLite if not provided)
FRONTEND_URL=http://localhost:5173
PORT=8080
```

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```
VITE_API_URL=http://localhost:8080/api
```

## Running the Application

### Development Mode

1. Start the server (from `server` directory):
```bash
npm run dev
```
Server will start on http://localhost:8080

2. Start the client (from `client` directory):
```bash
npm run dev
```
Client will start on http://localhost:5173

### Production Mode

Server:
```bash
npm start
```

Client:
```bash
npm run build
npm run preview
```

### Database Seeding

To populate the database with sample data (from `server` directory):
```bash
npm run seed
```

## API Endpoints

### Users
- `GET /api/users/reviewers` - Get all reviewers

### Conferences
- `GET /api/conferences` - Get all conferences
- `POST /api/conferences` - Create new conference

### Articles
- `GET /api/articles/conference/:conferenceId` - Get articles by conference
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article (with PDF upload)
- `PATCH /api/articles/:id` - Update article (upload new version)
- `PATCH /api/articles/:id/status` - Update article status
- `GET /api/articles/:id/pdf` - Get article PDF file

### Comments
- `GET /api/comments/article/:articleId` - Get comments by article
- `POST /api/comments` - Create comment

## Project Structure

```
conference_organizer/
├── client/                    # Frontend React application
│   ├── public/
│   │   └── mock/             # Sample PDF files
│   ├── src/
│   │   ├── api/              # API request modules
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React Context (UserContext)
│   │   ├── pages/            # Page components
│   │   └── App.jsx           # Main app component
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Backend Express application
    ├── src/
    │   ├── config/           # Multer configuration
    │   ├── controllers/      # Request handlers
    │   ├── core/             # App, server, and database setup
    │   ├── models/           # Sequelize models
    │   ├── router/           # API routes
    │   └── seed.js           # Database seeding script
    └── package.json
```

## Database

The application supports both SQLite (development) and PostgreSQL (production). The database will be created automatically on first run. To switch between databases, set or unset the `DATABASE_URL` environment variable.

### Models:
- **User** - Stores user information and roles
- **Conference** - Conference details and assigned reviewers
- **Article** - Submitted articles with PDF data and versioning
- **Comment** - Review comments with visibility settings

## User Roles

- **Author**: Can submit articles to conferences and view feedback
- **Reviewer**: Can review assigned articles and leave internal/public comments
- **Organizer**: Full access to manage conferences, allocate reviewers, and moderate content

## Deployment

The application is deployed on Render with:
- Frontend: Static site deployment
- Backend: Web service with PostgreSQL database
- Automatic deployments on git push
