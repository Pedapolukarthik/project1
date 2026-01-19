# How to Start Your Application

## 🚀 Quick Start Guide

Your application needs **TWO servers** running:

1. **Backend Server** (Node.js API) - Port 5000
2. **Frontend Server** (React App) - Port 3000 or 3001

---

## Step 1: Start Backend Server

### Open Terminal 1 (Backend)

```bash
cd third/sample/backend
node index.js
```

**You should see:**
```
MySQL connected...
Backend running on http://localhost:5000
```

**Keep this terminal open!** The backend must stay running.

---

## Step 2: Start Frontend Server

### Open Terminal 2 (Frontend)

```bash
cd third/sample
npm start
```

**You should see:**
```
Compiled successfully!
You can now view sample in the browser.
  Local:            http://localhost:3000
```

The browser should open automatically.

---

## ✅ Verification

### Check Backend is Running:
```bash
netstat -ano | findstr ":5000"
```
Should show port 5000 is LISTENING

### Check Frontend is Running:
```bash
netstat -ano | findstr ":3000"
```
Should show port 3000 is LISTENING

---

## 🎯 What Each Server Does

### Backend Server (Port 5000)
- Handles API requests
- Connects to MySQL database
- Processes login, registration, events
- **Must be running for frontend to work**

### Frontend Server (Port 3000/3001)
- Serves the React application
- Displays the UI
- Makes API calls to backend
- Hot reloads on code changes

---

## 🚨 Common Errors

### Error: "Server error. Please try again."
**Cause:** Backend server not running  
**Fix:** Start backend server (Step 1)

### Error: "Cannot GET /"
**Cause:** Frontend server not running  
**Fix:** Start frontend server (Step 2)

### Error: "Port 5000 already in use"
**Cause:** Another process using port 5000  
**Fix:** Stop the other process or change port

### Error: "MySQL connection failed"
**Cause:** MySQL not running or wrong credentials  
**Fix:** Start MySQL and check `backend/config/db.js`

---

## 📋 Daily Workflow

1. **Start MySQL** (if not running as service)
2. **Start Backend:** `cd third/sample/backend && node index.js`
3. **Start Frontend:** `cd third/sample && npm start`
4. **Use the application** in browser
5. **Stop servers:** Press `Ctrl + C` in each terminal when done

---

## 🔧 Troubleshooting

### Backend won't start?
- Check if port 5000 is available
- Check MySQL is running
- Check database credentials
- Look for error messages in console

### Frontend won't start?
- Check if port 3000 is available
- Run `npm install` if needed
- Check for syntax errors
- Clear browser cache

### Can't login?
- Verify backend is running
- Check browser console (F12) for errors
- Verify users table exists in database
- Check backend console for errors

---

## 📝 Summary

**Always start BOTH servers:**
1. Backend: `cd third/sample/backend && node index.js`
2. Frontend: `cd third/sample && npm start`

**Keep both terminals open while working!**




