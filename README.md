# 📝 Blog App

A modern blog backend API built with **Express.js** and **TypeScript**, featuring full-text search capabilities and cloud database integration.

## 📦 Tech Stack

- **Backend**: Node.js + Express.js (TypeScript)
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Search Engine**: Elasticsearch 8.x (Full-text search)
- **Containerization**: Docker + Docker Compose

## 🚀 Features

- ✅ RESTful Blog API
- 🔍 Elasticsearch integration for fast full-text search
- ☁️ MongoDB Atlas cloud database
- 🐳 Fully dockerized setup
- 🛡️ Input validation with Zod
- 🏗️ Clean architecture with separation of concerns

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- MongoDB Atlas account (free tier available)

## 📁 Project Structure

```
├── src/
│   ├── config/         # Configuration files (DB, Elasticsearch)
│   ├── constants/      # Application constants
│   ├── controllers/    # Controller functions 
│   ├── enums/          # all enum values
│   ├── errors/         # Custom error classes and handlers
│   ├── interfaces/     # all type interfaces files
│   ├── jwt/            # JWT functions and configurations
│   ├── models/         # Mongoose data models
│   ├── middlewares/    # All middleware functions
│   ├── routes/         # Express route definitions
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # Business logic layer
│   ├── utils/          # Utility functions
│   ├── validations/    # all validation functions
│   ├── index.ts        # Application entry point
│   └── server.ts       # Server configuration
├── Dockerfile          # Docker container config
├── docker-compose.yml  # Multi-service Docker setup
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
├── package-lock.json   # Dependencies and its versions
├── .dockerignore       # specifies files to ignore on docker
├── .gitignore          # specifies the files wich to be ignored on git
├── .env                # Environment variables
└── README.md           # Project documentation
```

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd blog-app
```

### 2. Install dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogdb
ELASTIC_URI=http://elasticsearch:9200
NODE_ENV=development
```

> **Note**: Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

## 🚀 Getting Started

### Development Mode

```bash
# Start development server with hot reload
npm run dev
```

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

**Services will be available at:**
- **API Server**: http://localhost:3000
- **Elasticsearch**: http://localhost:9200

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint code analysis |
| `npm test` | Run test suite |

## 📚 API Endpoints

### Blog Posts
```http
GET    /api/blogs           # Get all blog posts
POST   /api/blogs           # Create new blog post
GET    /api/blogs/:id       # Get specific blog post
PUT    /api/blogs/:id       # Update blog post
DELETE /api/blogs/:id       # Delete blog post
```

### Search
```http
GET    /api/search?q=keyword    # Full-text search blogs
GET    /api/search?q=keyword&page=1&limit=10    # Paginated search
```

### Example API Usage

#### Create a Blog Post
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "content": "This is the content of my blog post",
    "author": "John Doe",
    "tags": ["technology", "web development"]
  }'
```

#### Search Blogs
```bash
curl "http://localhost:3000/api/search?q=technology"
```

## 🔍 Testing Elasticsearch

Verify Elasticsearch is running:

```bash
# Check Elasticsearch health
curl http://localhost:9200

# Check cluster info
curl http://localhost:9200/_cluster/health
```

## 🐳 Docker Services

The `docker-compose.yml` includes:
- **app**: Express.js application
- **elasticsearch**: Elasticsearch search engine
- **kibana** (optional): Elasticsearch management UI

## 📊 Monitoring & Logs

```bash
# View application logs
docker-compose logs app

# View Elasticsearch logs
docker-compose logs elasticsearch

# Follow logs in real-time
docker-compose logs -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Issues:**
- Verify your MongoDB Atlas credentials
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database name matches your URI

**Elasticsearch Connection Issues:**
- Confirm Elasticsearch container is running: `docker ps`
- Check Elasticsearch logs: `docker-compose logs elasticsearch`
- Verify port 9200 is not blocked by firewall

**Docker Issues:**
- Clear Docker cache: `docker system prune`
- Rebuild containers: `docker-compose up --build --force-recreate`

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review Docker and Elasticsearch documentation

---

Built with ❤️ using TypeScript, Express.js, and Elasticsearch