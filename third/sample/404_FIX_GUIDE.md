# Fix for 404 Error on Event Registration

## 🔍 Problem Identified

**Error:** `Cannot POST /api/events/3/register` (404 Not Found)

**Root Cause:** The backend server was started BEFORE the registration routes were added to the code. The running server doesn't know about the new `/api/events/:eventId/register` route.

---

## ✅ Solution: Restart Backend Server

### Step 1: Stop the Current Backend Server

1. Find the terminal/command prompt where the backend is running
2. Press `Ctrl + C` to stop it
3. You should see the server stop

### Step 2: Restart the Backend Server

```bash
cd third/sample/backend
node index.js
```

You should see:
```
MySQL connected...
Backend running on http://localhost:5000
```

### Step 3: Verify the Route is Working

The route should now be available at:
- **POST** `http://localhost:5000/api/events/:eventId/register`

---

## 📋 Complete Route List (After Restart)

Your backend now has these routes:

1. `POST /api/events/create` - Create event
2. `GET /api/events/all` - Get all events
3. `GET /api/events/students/all` - Get all students
4. `PUT /api/events/update/:id` - Update event
5. `DELETE /api/events/delete/:id` - Delete event
6. **`POST /api/events/:eventId/register`** - Register student (NEW)
7. `GET /api/events/:eventId/registrations` - Get registrations (NEW)

---

## 🧪 Test After Restart

1. **Restart backend server**
2. **Try registering again** from the Student Dashboard
3. **Check browser console** (F12) for any errors
4. **Check backend console** for request logs

---

## 🔧 Why This Happens

**Express.js loads routes when the server starts.** If you:
1. Start the server
2. Then add new routes to the code
3. The running server doesn't know about the new routes

**Solution:** Always restart the server after adding new routes.

---

## ✅ Verification Checklist

After restarting:
- [ ] Backend server shows "Backend running on http://localhost:5000"
- [ ] MySQL connection successful
- [ ] Try registering from Student Dashboard
- [ ] Should see success message (not 404 error)

---

## 🚨 If Still Getting 404 After Restart

1. **Check route order** - `/students/all` must be before `/:eventId/register`
2. **Verify file saved** - Make sure `eventRoutes.js` has the registration route
3. **Check backend console** - Look for any error messages
4. **Verify port** - Backend should be on port 5000

---

## 📝 Quick Test Command

After restarting, you can test with:

```bash
cd third/sample/backend
node testRegistrationEndpoint.js
```

This will test if the registration endpoint is working.


