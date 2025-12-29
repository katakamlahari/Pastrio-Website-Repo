# ⚡ Quick Start Guide

## 30-Second Setup

### Terminal 1: Start MongoDB
```bash
mongod
```

Wait for: `waiting for connections on port 27017`

### Terminal 2: Start Server
```bash
cd "c:\Users\Harsha\OneDrive\Desktop\pastebin clone"
npm start
```

Wait for: `🚀 Server is running at http://localhost:3000`

### Browser
Open: **http://localhost:3000**

---

## What You Get

### Home Page (`/`)
- Paste content text area
- Optional expiration settings (minutes/hours/days)
- Optional max views limit
- Create button

### Success Response
- Shareable link (e.g., `http://localhost:3000/a1b2c3`)
- Copy-to-clipboard button
- Direct link to paste

### Paste View Page (`/:hash`)
- Display paste content in code block
- Show view count
- Show creation time
- Copy paste content button

### Auto-Expiration
- **Time**: Pastes delete after set time
- **Views**: Pastes delete after N views
- **Both**: Whichever comes first

---

## Example Flow

1. **Create** → Enter text → Click "Create Paste"
2. **Share** → Get link `http://localhost:3000/x9k2m1`
3. **View** → Anyone visits the link
4. **Auto-delete** → When time expires OR view limit hit

---

## File Structure

```
✅ .env                    - Config (MONGODB_URI, PORT)
✅ server.js               - Express app
✅ src/models/Paste.js     - MongoDB schema
✅ src/controllers/        - Business logic
✅ src/routes/             - API endpoints
✅ src/middleware/         - Error handling
✅ views/*.ejs             - HTML templates
✅ public/css/style.css    - Styling
✅ public/js/app.js        - Frontend logic
✅ package.json            - Dependencies
✅ README.md               - Full documentation
```

---

## Stop the Server

Press `Ctrl + C` in terminal running `npm start`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Cannot connect to MongoDB" | Run `mongod` in another terminal |
| "Port 3000 in use" | Change PORT in `.env` |
| "POST /api/paste/create 502" | Check MongoDB is running |
| Styling not loading | Clear browser cache (Ctrl+Shift+Delete) |

---

## Next Steps

- Modify CSS in `public/css/style.css`
- Add features in `src/controllers/pasteController.js`
- Add routes in `src/routes/pasteRoutes.js`
- Change expiration logic in `src/models/Paste.js`

---

**Ready? Start MongoDB and run `npm start`!** 🚀
