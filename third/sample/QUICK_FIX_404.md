# Quick Fix: 404 Error on Registration

## 🎯 The Problem

When clicking "Register Now", you get:
```
Registration failed: Request failed with status code 404
```

**Error in backend:** `Cannot POST /api/events/3/register`

---

## ✅ The Solution (Simple!)

**The backend server needs to be restarted** to load the new registration routes.

### Steps:

1. **Stop the backend server:**
   - Go to the terminal where `node index.js` is running
   - Press `Ctrl + C`

2. **Restart the backend server:**
   ```bash
   cd third/sample/backend
   node index.js
   ```

3. **Try registering again** from Student Dashboard

---

## 🔍 Why This Happens (Beginner-Friendly)

Think of it like this:
- When you start the backend server, it reads all the route files
- It creates a "map" of all available routes
- If you add new routes AFTER the server started, the server doesn't know about them
- The server's "map" is outdated

**Solution:** Restart the server so it reads the updated route files and creates a new "map" with all routes.

---

## 📋 What Routes Are Now Available

After restarting, these routes will work:

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/events/create` | Create event |
| GET | `/api/events/all` | Get all events |
| GET | `/api/events/students/all` | Get all students |
| PUT | `/api/events/update/:id` | Update event |
| DELETE | `/api/events/delete/:id` | Delete event |
| **POST** | **`/api/events/:eventId/register`** | **Register student** ✅ |
| GET | `/api/events/:eventId/registrations` | Get registrations |

---

## 🧪 Verify It's Working

After restarting the backend:

1. **Check backend console** - Should show:
   ```
   MySQL connected...
   Backend running on http://localhost:5000
   ```

2. **Try registering** from Student Dashboard
   - Click "Register Now" on any event
   - Should see "Successfully registered for the event!" (not 404 error)

3. **Check browser console** (F12)
   - Should see successful request
   - Status: 201 (Created) or 200 (OK)

---

## 🔧 Technical Details

### Frontend Request (StudentDashboard.js)
```javascript
axios.post(
  `http://localhost:5000/api/events/${eventId}/register`,
  {
    username: 'student',
    name: 'Student Name',
    email: 'student@univ.edu',
    department: 'CSE'
  }
)
```

### Backend Route (eventRoutes.js)
```javascript
router.post('/:eventId/register', registerForEvent);
```

### Backend Controller (eventController.js)
```javascript
exports.registerForEvent = (req, res) => {
  const eventId = req.params.eventId;
  // ... registration logic
}
```

---

## ✅ Verification Checklist

- [ ] Backend server restarted
- [ ] Backend shows "Backend running on http://localhost:5000"
- [ ] MySQL connection successful
- [ ] Try registering from Student Dashboard
- [ ] Success message appears (not 404 error)
- [ ] Check database - registration should be saved

---

## 🚨 If Still Not Working

1. **Verify backend is running:**
   ```bash
   netstat -ano | findstr ":5000"
   ```
   Should show port 5000 is LISTENING

2. **Check route file is saved:**
   - Open `backend/routes/eventRoutes.js`
   - Verify line 32: `router.post('/:eventId/register', registerForEvent);`

3. **Check controller function exists:**
   - Open `backend/controllers/eventController.js`
   - Verify `exports.registerForEvent` function exists

4. **Check backend console for errors:**
   - Look for any error messages when starting server
   - Look for errors when clicking Register

---

## 📝 Summary

**Problem:** 404 error when registering  
**Cause:** Backend server started before registration routes were added  
**Fix:** Restart backend server  
**Result:** Registration works! ✅

---

## 🎉 After Fix

Once the backend is restarted:
- ✅ Students can register for events
- ✅ Registration data saved to database
- ✅ Admin can view registered students
- ✅ No more 404 errors!


