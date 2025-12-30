# 📝 Pastebin Clone

A fast, simple pastebin application built with Node.js, Express, and MongoDB. Share code and text instantly with unique, shareable links.

## ✨ Features

- **Instant Sharing** - Generate unique, short URLs instantly
- **Time-based Expiration** - Auto-delete pastes after minutes, hours, or days
- **View-based Expiration** - Auto-delete after a certain number of views
- **Clean UI** - Simple, modern, and responsive design
- **No Account Needed** - Just paste and share
- **Copy to Clipboard** - One-click copying

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Templating:** EJS
- **Hash Generation:** nanoid
- **Environment:** dotenv

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)

### Verify Installation

```bash
node --version
npm --version
mongod --version
```

## 🚀 Quick Start

### 1. Clone/Navigate to Project

```bash
cd "c:\Users\Harsha\OneDrive\Desktop\pastebin clone"
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **ejs** - Templating engine
- **dotenv** - Environment variables
- **nanoid** - Unique ID generation
- **express-rate-limit** - API rate limiting

### 3. Start MongoDB

**Option A: MongoDB Community (Local Installation)**

Open a new terminal and run:
```bash
mongod
```

You should see:
```
{"t":{"$date":"2025-12-29T..."},"s":"I","c":"NETWORK","id":23016,"ctx":"listener","msg":"Waiting for connections","attr":{"port":27017}}
```

**Option B: MongoDB Atlas (Cloud)**

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Update `.env` file with your connection string:
  ```
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pastebin-clone
  ```

### 4. Start the Application

In your project terminal (keep MongoDB running):

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running at http://localhost:3000
📝 Create paste at http://localhost:3000
```

### 5. Open in Browser

Visit: **http://localhost:3000**

## 📖 How to Use

### Creating a Paste

1. Enter your code or text in the text area
2. (Optional) Set expiration:
   - Time-based: Minutes, Hours, or Days
   - View-based: Maximum number of views
3. Click **Create Paste**
4. Copy the generated link and share!

### Viewing a Paste

1. Click the shareable link
2. View is automatically tracked
3. If view limit is reached, paste auto-deletes
4. If expiration time passed, paste is deleted

## 📁 Project Structure

```
pastebin-clone/
├── public/                 # Frontend assets
│   ├── css/
│   │   └── style.css      # All styling (responsive)
│   └── js/
│       └── app.js         # Form handling & copy-to-clipboard
├── src/
│   ├── models/
│   │   └── Paste.js       # MongoDB schema & methods
│   ├── controllers/
│   │   └── pasteController.js  # Business logic
│   ├── routes/
│   │   └── pasteRoutes.js # API routes
│   └── middleware/
│       └── errorHandler.js # Error handling
├── views/                 # EJS templates
│   ├── index.ejs         # Home page
│   ├── paste.ejs         # Paste view page
│   └── error.ejs         # Error page
├── server.js             # Express app entry point
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.md            # This file
```

## ⚙️ Configuration

Edit `.env` to customize:

```env
PORT=3000                                    # Server port
NODE_ENV=development                        # Environment
MONGODB_URI=mongodb://localhost:27017/pastebin-clone  # MongoDB URL
HASH_LENGTH=6                                # Length of unique URL hash (6 = short URLs)
```

## 🔗 API Endpoints

### Create Paste

```
POST /api/paste/create

Body:
{
  "content": "your code here",
  "expirationTime": 30,
  "expirationUnit": "minutes",  // or "hours", "days"
  "maxViews": 5
}

Response:
{
  "success": true,
  "url": "/a1b2c3",
  "hash": "a1b2c3"
}
```

### View Paste

```
GET /:hash
Returns HTML page with paste content
```

### Get Paste as JSON

```
GET /api/paste/:hash/json

Response:
{
  "success": true,
  "data": {
    "hash": "a1b2c3",
    "content": "...",
    "views": 2,
    "createdAt": "2025-12-29T..."
  }
}
```

## 🔒 Security Features

- **Input Sanitization** - EJS auto-escapes HTML
- **No SQL Injection** - Mongoose validates inputs
- **No XSS Attacks** - Content rendered safely
- **Unique Hashes** - Collision-proof nanoid IDs

### Additional Security Tips

For production:
1. Enable HTTPS (use reverse proxy like Nginx)
2. Add rate limiting (already included in dependencies)
3. Use environment variables for secrets
4. Enable MongoDB authentication
5. Add CORS if needed

## 📊 Expiration Logic

### Time-based Expiration
- Uses MongoDB TTL indexes
- Automatically deletes on access if expired
- Set minutes/hours/days at creation

### View-based Expiration
- Tracks view count per paste
- Decrements on each visit
- Auto-deletes when views reach 0

### Combined
- Both can be set together
- Paste deletes when either condition is met

## 🐛 Troubleshooting

### "MongoDB connection error"

**Problem:** Server won't connect to MongoDB

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   mongod
   ```
2. Check MongoDB port (default: 27017)
3. Verify `.env` has correct MONGODB_URI
4. For MongoDB Atlas, check IP whitelist

### "Port 3000 already in use"

Change PORT in `.env`:
```env
PORT=3001
```

### Form won't submit

1. Check browser console (F12)
2. Ensure MongoDB is running
3. Verify server is running
4. Check that `http://localhost:3000` is accessible

## 🚀 Development Mode

For auto-restart on file changes, install nodemon:

```bash
npm install --save-dev nodemon
```

Then use:
```bash
npm run dev
```

Update `package.json` if needed:
```json
"dev": "nodemon server.js"
```

## 📈 Scaling Ideas

To scale like real Pastebin:

1. **Caching** - Add Redis for frequently accessed pastes
2. **CDN** - Serve static files from CDN
3. **Load Balancing** - Use multiple servers with nginx
4. **Database** - Implement sharding for large data
5. **Analytics** - Track paste creation/views
6. **Dark Mode** - Add theme toggle
7. **Syntax Highlighting** - Use Highlight.js
8. **Password Protection** - Add optional paste passwords
9. **Burn After Reading** - Auto-delete after first view
10. **API Keys** - Allow programmatic paste creation

## 📄 License

ISC License - Feel free to use and modify!

## 👨‍💻 Author

Built as an educational project to demonstrate:
- Full-stack JavaScript development
- REST API design
- MongoDB integration
- Frontend form handling
- EJS templating

## 🤝 Contributing

Feel free to fork, modify, and improve!

---

**Ready to paste?** 🚀

1. Start MongoDB: `mongod`
2. Start server: `npm start`
3. Visit: `http://localhost:3000`
4. Create your first paste!
