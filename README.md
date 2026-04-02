# DC Editor Backend

A powerful Node.js + Express backend for the DC Editor application. Handles code execution, file storage, real-time collaboration, and user authentication.

## 🚀 Features

- **Code Execution**: Execute code in isolated environments
- **Real-time Communication**: WebSocket support via Socket.io
- **File Storage**: Integration with Cloudinary
- **Job Queue**: Redis-based task queue with BullMQ
- **Authentication**: Clerk-based user authentication
- **Video/Voice**: LiveKit integration for real-time communication
- **Database**: PostgreSQL for persistent data
- **API Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**
- **PostgreSQL**: Database server
- **Redis**: For job queue
- **Third-party Services**:
  - Clerk (Authentication)
  - Cloudinary (File Storage)
  - LiveKit (Video/Voice)

## 🔧 Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/dc-editor-backend.git
cd dc-editor-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy template to .env
cp .env.example .env

# Edit .env with your actual values
# Use your text editor to fill in:
# - DATABASE_URL
# - CLERK_SECRET_KEY
# - REDIS_URL
# - CLOUDINARY credentials
# - LIVEKIT credentials
# - JWT_SECRET
```

### 4. Setup Database
```bash
# Run migrations (if you have them) or:
# Import schema_pgadmin.sql in your PostgreSQL client
psql -U postgres -d dc_editor -f database/schema_pgadmin.sql
```

### 5. Start Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### 6. Start Worker (in separate terminal)
```bash
npm run worker
```
Worker processes background jobs from Redis queue.

## 📦 Project Structure

```
server/
├── index.js                 # Main Express application
├── execution/               # Code execution logic
│   └── executor.js
├── queue/                   # Redis queue management
│   ├── executionQueue.js
│   └── redis.js
├── storage/                 # File storage services
│   ├── cloudinaryClient.js
│   └── fileStorage.js
├── templates/               # Template projects (Vue, Next.js)
│   ├── vue-vite-js/
│   ├── vue-vite-ts/
│   └── next-*/ (various Next.js templates)
└── worker/                  # Background job worker
    └── executionWorker.js

docker/
├── api.Dockerfile           # API server container
└── worker.Dockerfile        # Worker process container

database/
└── schema_pgadmin.sql       # PostgreSQL schema

scripts/
├── health-check.mjs         # Health check endpoint test
└── verify-*.mjs             # Verification scripts for templates
```

## 🐳 Docker Setup

### Build Docker Images
```bash
docker build -f docker/api.Dockerfile -t dc-editor-api:latest .
docker build -f docker/worker.Dockerfile -t dc-editor-worker:latest .
```

### Run with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up
```

## 🚢 Deployment to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial backend setup"
git push origin main
```

### Step 2: Create Render Web Service
1. Go to [Render.com](https://render.com)
2. Click **"Create"** → **"Web Service"**
3. Connect your GitHub repository (`dc-editor-backend`)
4. Configure settings:
   - **Name**: `dc-editor-api` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Plan**: Choose based on your needs

### Step 3: Add Environment Variables
In Render dashboard, go to **Environment** and add all variables from `.env.example`:
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `REDIS_URL`
- `CLOUDINARY_*`
- `LIVEKIT_*`
- etc.

### Step 4: Deploy
Click **"Deploy"** and wait for the service to start.

### Step 5: Deploy Worker (Optional but Recommended)
Create a second Render service for the worker:
- Same repository, but:
- **Start Command**: `npm run worker`
- Set as a **Background Worker** service

## 🔌 API Endpoints

Your backend will expose RESTful API endpoints. Update this section with actual endpoints, or generate from your code.

### Health Check
```bash
GET /health
```

## 🧪 Testing

### Health Check Script
```bash
npm run health:check
```

### Verify Template Projects
```bash
npm run verify:variants
```

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Yes | Clerk authentication secret |
| `REDIS_URL` | Yes | Redis connection URL |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `LIVEKIT_URL` | Yes | LiveKit server URL |
| `LIVEKIT_API_KEY` | Yes | LiveKit API key |
| `LIVEKIT_API_SECRET` | Yes | LiveKit API secret |
| `FRONTEND_URL` | Yes | Frontend application URL (for CORS) |
| `PORT` | No | Server port (default: 3000) |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |

## 🛠️ Troubleshooting

### Redis Connection Error
- Ensure Redis is running: `redis-cli ping` should return `PONG`
- Check `REDIS_URL` is correct

### Database Connection Error
- Verify PostgreSQL is running
- Check `DATABASE_URL` format and credentials
- Run: `psql -U postgres -c "SELECT 1"` to test connection

### Cloudinary Error
- Verify `CLOUDINARY_API_SECRET` is correct (not API key)
- Check cloud name matches your account

## 📚 Dependencies

Key dependencies installed:
- `express` - Web framework
- `pg` - PostgreSQL client
- `socket.io` - Real-time communication
- `bullmq` - Job queue
- `ioredis` - Redis client
- `@clerk/express` - Authentication
- `cloudinary` - File storage
- `livekit-server-sdk` - Video/Voice SDK

## 📄 License

MIT

## 👨‍💻 Support

For issues or questions, please open an issue on GitHub.
