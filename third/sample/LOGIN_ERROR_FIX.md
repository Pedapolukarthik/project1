# Fix: "Server error. Please try again." on Login

## 🔍 Problem Identified

**Error:** "Server error. Please try again." when trying to log in

**Root Cause:** The backend server is not running on port 5000, so the frontend cannot connect to the API.

---

## ✅ Solution: Start Backend Server

### Step 1: Start the Backend Server

Open a terminal/command prompt and run:

```bash
cd third/sample/backend
node index.js
```

You should see:
```
MySQL connected...
Backend running on http://localhost:5000
```

### Step 2: Keep the Server Running

**Important:** Keep this terminal window open while using the application. The server must be running for the frontend to work.

### Step 3: Try Logging In Again

1. Go back to the Student Login page
2. Enter your username and password
3. Click "Login"
4. Should work now! ✅

---

## 🔧 Why This Happens

The frontend (React app) runs on `localhost:3000` or `localhost:3001`
The backend (Node.js API) runs on `localhost:5000`

When you click "Login", the frontend tries to connect to:
```
http://localhost:5000/api/login
```

If the backend server is not running:
- ❌ Connection fails
- ❌ Frontend shows "Server error. Please try again."

---

## 📋 Quick Checklist

- [ ] Backend server is running (`node index.js` in backend folder)
- [ ] You see "Backend running on http://localhost:5000" message
- [ ] MySQL connection is successful
- [ ] Frontend is running (React app)
- [ ] Try logging in again

---

## 🚨 Common Issues

### Issue 1: Port 5000 Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Find and stop the process using port 5000
2. Or change the port in `backend/index.js`

### Issue 2: MySQL Connection Failed
**Error:** `MySQL connection error`

**Solution:**
1. Make sure MySQL is running
2. Check database credentials in `backend/config/db.js`
3. Verify database `loginDB` exists

### Issue 3: Users Table Doesn't Exist
**Error:** `Table 'loginDB.users' doesn't exist`

**Solution:**
Create the users table:
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

---

## 🧪 Test the Login Endpoint

After starting the backend, you can test with:

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

Or use the test script:
```bash
cd third/sample/backend
node testLogin.js
```

---

## 📝 Summary

**Problem:** "Server error. Please try again."  
**Cause:** Backend server not running  
**Fix:** Start backend server with `node index.js`  
**Result:** Login works! ✅

---

## 🎯 Next Steps

1. **Start backend server** (if not already started)
2. **Try logging in** with valid credentials
3. **If still errors**, check:
   - Backend console for error messages
   - Browser console (F12) for network errors
   - Database connection

The backend server must be running for the entire application to work!




