# Breakverse Backend API

A comprehensive REST API for the Breakverse breakdance learning platform.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Move System**: CRUD operations for breakdance moves with categories and levels
- **Badge System**: Achievement system with requirements and rewards
- **Event Management**: Workshops, competitions, and events
- **Battle System**: 1v1 battles with voting and video submissions
- **Crew System**: Crew management and member roles
- **Admin Panel**: Full admin interface for managing all data

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/breakverse
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Models

### User Model
- Authentication (username, email, password)
- Profile data (name, level, XP)
- Move management (masteredMoves, pendingMoves)
- Crew membership and badges
- Admin status and permissions

### Move Model
- Name, category, level, XP value
- Video URL and description
- Recommendations and difficulty rating
- Active/inactive status

### Badge Model
- Name, description, category, level
- Image and emoji
- Requirements (moves, XP, level)
- Rarity levels

### Event Model
- Title, description, category
- Date, location, organizer
- Participants and pricing
- Status management

### Battle Model
- Challenger and opponent
- Video submissions
- Voting system
- Status tracking

### Crew Model
- Name, description, logo
- Members with roles
- Social media links
- Achievements

## 🔌 API Endpoints

### Moves
- `GET /api/moves` - Get all moves with filtering
- `GET /api/moves/:id` - Get move by ID
- `GET /api/moves/category/:category` - Get moves by category
- `GET /api/moves/level/:level` - Get moves by level
- `POST /api/moves` - Create new move
- `PUT /api/moves/:id` - Update move
- `DELETE /api/moves/:id` - Delete move

### Users
- `GET /api/users` - Get all users with filtering
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:userId/stats` - Get user statistics
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Move Management
- `POST /api/users/:userId/moves/:moveId/master` - Add mastered move
- `DELETE /api/users/:userId/moves/:moveId/master` - Remove mastered move
- `POST /api/users/:userId/moves/:moveId/pending` - Add pending move request
- `PUT /api/users/:userId/moves/:moveId/approve` - Approve pending move
- `PUT /api/users/:userId/moves/:moveId/reject` - Reject pending move

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/:id` - Get badge by ID
- `POST /api/badges` - Create new badge
- `PUT /api/badges/:id` - Update badge
- `DELETE /api/badges/:id` - Delete badge

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Battles
- `GET /api/battles` - Get all battles
- `GET /api/battles/:id` - Get battle by ID
- `POST /api/battles` - Create new battle
- `PUT /api/battles/:id` - Update battle
- `DELETE /api/battles/:id` - Delete battle

### Crews
- `GET /api/crews` - Get all crews
- `GET /api/crews/:id` - Get crew by ID
- `POST /api/crews` - Create new crew
- `PUT /api/crews/:id` - Update crew
- `DELETE /api/crews/:id` - Delete crew

## 🔧 Query Parameters

### Filtering
- `search` - Search by name/description
- `category` - Filter by category
- `level` - Filter by level
- `status` - Filter by status

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Sorting
- `sortBy` - Field to sort by
- `sortOrder` - 'asc' or 'desc'

## 🎯 Example Usage

### Get moves with filtering
```bash
curl "http://localhost:5000/api/moves?category=Footwork&level=Beginner&page=1&limit=10"
```

### Get users with search
```bash
curl "http://localhost:5000/api/users?search=john&status=active&page=1&limit=20"
```

### Add mastered move to user
```bash
curl -X POST "http://localhost:5000/api/users/123/moves/456/master"
```

## 🚀 Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Database Seeding
The seeder will create:
- Sample moves (20+ moves across all categories)
- Sample badges (3 badges with different rarities)
- Sample events (2 events)
- Sample users (admin + 2 regular users)

## 🔒 Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (planned)
- JWT authentication (planned)

## 📊 Database Indexes

Optimized indexes for:
- User queries (username, email, status)
- Move queries (category, level, name)
- Badge queries (category, level)
- Event queries (date, status, category)
- Battle queries (status, challenger, opponent)

## 🐛 Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description"
}
```

## 📈 Performance

- Database indexing for fast queries
- Pagination for large datasets
- Population of related data
- Efficient filtering and sorting

## 🔄 Next Steps

1. **Authentication System**
   - JWT token implementation
   - User login/logout
   - Password reset

2. **File Upload**
   - Image upload for badges/events
   - Video upload for battles
   - Profile picture upload

3. **Real-time Features**
   - WebSocket for live battles
   - Real-time notifications
   - Live chat

4. **Advanced Features**
   - Email notifications
   - Payment integration
   - Social media integration
   - Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 