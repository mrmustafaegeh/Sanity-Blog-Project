Modern Blog Platform - README
🚀 Overview
A full-featured, production-ready blog platform built with a modern tech stack featuring Sanity CMS as the content backbone, Express.js backend, React frontend, Redis caching, and AI-powered features.

🛠 Tech Stack
Frontend
React 18 with Vite for fast development

Tailwind CSS for utility-first styling

Redux Toolkit with RTK Query for state management

React Router v6 for navigation

React Hook Form for forms

React Icons for icons

Framer Motion for animations

Backend
Express.js REST API

Sanity CMS for content management

Redis for caching and session management

Node.js runtime

AI & Automation
OpenAI GPT-4 for AI-generated summaries

Sanity Webhooks for real-time updates

Automated SEO with schema.org markup

DevOps & Deployment
GitHub Actions for CI/CD

Environment-based configuration

Rate limiting and security middleware

📁 Project Structure
text
Sanity-Blog-Project/
├── backend/ # Express.js backend
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── middleware/ # Express middleware
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic
│ │ ├── utils/ # Utility functions
│ │ └── redis/ # Redis client setup
│ ├── package.json
│ └── server.js # Entry point
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── api/ # API service layer
│ │ ├── components/ # React components
│ │ ├── features/ # Feature-based modules
│ │ ├── pages/ # Page components
│ │ ├── store/ # Redux store
│ │ └── services/ # Frontend services
│ ├── public/ # Static assets
│ ├── package.json
│ └── vite.config.js
│
└── sanity/ # Sanity CMS studio (git submodule)
├── schemas/ # Content schemas
├── plugins/ # Sanity plugins
└── sanity.config.js
🚀 Getting Started
Prerequisites
Node.js 18+ and npm

Redis server (for caching)

Sanity.io account

OpenAI API key (for AI features)

Installation
Clone the repository

bash
git clone <your-repo-url>
cd Sanity-Blog-Project
Install frontend dependencies

bash
cd frontend
npm install
Install backend dependencies

bash
cd ../backend
npm install
Set up Sanity Studio (if using submodule)

bash
cd sanity
npm install
Environment Variables
Backend (.env in backend/)

env
NODE_ENV=development
PORT=5000
VITE_API_URL=http://localhost:5000/api
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
SANITY_WEBHOOK_SECRET=your_webhook_secret
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
Frontend (.env in frontend/)

env
VITE_API_URL=http://localhost:5000/api
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_TOKEN=your_sanity_api_token
Running the Application
Start Redis server

bash

# macOS

brew services start redis

# Linux

sudo systemctl start redis-server

# Or run directly

redis-server
Start the backend server

bash
cd backend
npm run dev
Start the frontend

bash
cd frontend
npm run dev
Start Sanity Studio (optional, for content editing)

bash
cd sanity
npm run dev
🌟 Features
Core Features
📝 Blog Management - Create, edit, and publish blog posts

🔍 Advanced Search - Full-text search with filters

📱 Responsive Design - Mobile-first approach

⚡ Performance Optimized - Redis caching, code splitting

🔒 Authentication - JWT-based auth with role management

AI-Powered Features
🤖 AI Summaries - Automatic post summarization using GPT-4

📊 SEO Optimization - Automated meta tags and schema markup

🔄 Real-time Updates - Sanity webhook integration

Admin Features
🎯 Dashboard - Analytics and post management

📈 AI Summary Management - View and regenerate AI summaries

👥 User Management - Role-based access control

Developer Features
📁 Modular Architecture - Clean separation of concerns

🔧 Type Safety - PropTypes and validation

🧪 Error Boundaries - Graceful error handling

📊 Performance Monitoring - Caching strategies

📊 API Endpoints
Posts
GET /api/posts - Get all posts (paginated)

GET /api/posts/:slug - Get single post by slug

GET /api/search - Search posts with filters

GET /api/categories - Get all categories

GET /api/sitemap.xml - Generate sitemap

GET /api/rss.xml - Generate RSS feed

Admin
POST /api/admin/login - Admin authentication

GET /api/admin/posts - Get posts with AI summaries

POST /api/admin/regenerate-summary/:postId - Regenerate AI summary

Webhooks
POST /api/webhooks/sanity - Handle Sanity updates

🎨 Frontend Components
Layout Components
Layout - Main layout wrapper

Navbar - Navigation header

Footer - Page footer

Blog Components
PostCard - Blog post card for listings

PostHeader - Post title and metadata

PostContent - Rich text content display

AISummary - AI-generated summary component

TableOfContents - Auto-generated table of contents

UI Components
SEO - SEO meta tags management

ArticleSchema - Structured data markup

Modal - Reusable modal component

Button - Styled button component

Card - Card container component

🔧 Development
Available Scripts
Frontend:

bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
Backend:

bash
npm run dev # Start with nodemon
npm start # Start production server
npm run test # Run tests
Code Style
ESLint with Airbnb config

Prettier for code formatting

Component-based architecture

Custom hooks for reusable logic
