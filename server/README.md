# Breakverse Server

Backend API for the Breakverse breakdance learning platform.

## 🚀 Deployment on Render

### Environment Variables Required:

```
PORT=10000
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
```

### Render Configuration:

- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node.js

### Health Check Endpoint:

- **URL:** `/health`
- **Expected Response:** `{"status":"OK","message":"Breakverse API is running"}`

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/     # Route handlers
│   ├── routes/         # API routes
│   ├── models/         # Database models
│   └── index.js        # Main server file
├── package.json
└── README.md
```

## 🔧 Available Endpoints

### Health Check
- `GET /health` - Server health status

### Moves API
- `GET /api/moves` - Get all moves
- `GET /api/moves/:id` - Get move by ID
- `GET /api/moves/category/:category` - Get moves by category
- `GET /api/moves/level/:level` - Get moves by level
- `POST /api/moves` - Create new move
- `PUT /api/moves/:id` - Update move
- `DELETE /api/moves/:id` - Delete move

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Other APIs (Placeholder)
- Badges: `/api/badges/*`
- Events: `/api/events/*`
- Battles: `/api/battles/*`
- Crews: `/api/crews/*`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 🔍 Troubleshooting

### Common Issues:

1. **Bad Gateway Error**: Check if MongoDB connection string is correct
2. **Module Not Found**: Ensure all files are committed to git
3. **Port Issues**: Verify PORT environment variable is set correctly

### Render Logs:

Check Render dashboard for detailed error logs if deployment fails. 