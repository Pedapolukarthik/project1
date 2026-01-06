# Fix: Multiple Students Can Register for Same Event

## 🔍 Problem Identified

**Issue:** When one student registers for an event, all other students are blocked from registering for the same event.

**Error Message:** "Student is already registered for this event"

**Root Cause:** All students were using the same default username (`'student'`), so the backend treated them as the same student.

---

## ✅ Solution Applied

### 1. Save Username on Login
**File:** `src/pages/StudentLogin.js`

When a student logs in, the username is now saved to localStorage:
```javascript
localStorage.setItem('username', username);
```

### 2. Generate Unique Username if Missing
**File:** `src/pages/StudentDashboard.js`

If no username is found in localStorage, a unique one is generated:
```javascript
const uniqueUsername = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```

This ensures each student session gets a unique identifier.

### 3. Backend Validation (Already Correct)
**File:** `backend/controllers/eventController.js`

The backend correctly checks BOTH `event_id` AND `student_id`:
```sql
SELECT * FROM event_registrations 
WHERE event_id = ? AND student_id = ?
```

---

## 🎯 How It Works Now

### Before (Broken):
1. Student A logs in → No username saved → Defaults to `'student'`
2. Student B logs in → No username saved → Defaults to `'student'`
3. Both students have same username → Backend treats them as same student
4. Student A registers → Success
5. Student B tries to register → Fails (same student_id)

### After (Fixed):
1. Student A logs in → Username saved to localStorage (e.g., `'john'`)
2. Student B logs in → Username saved to localStorage (e.g., `'jane'`)
3. Each student has unique username → Backend creates separate student records
4. Student A registers → Success (student_id = 1)
5. Student B registers → Success (student_id = 2) ✅

---

## 📋 Database Constraint

The database has a UNIQUE constraint on `(event_id, student_id)`:
```sql
UNIQUE KEY unique_registration (event_id, student_id)
```

This means:
- ✅ Same student + same event → NOT allowed (correct)
- ✅ Different student + same event → ALLOWED (correct)
- ✅ Same student + different event → ALLOWED (correct)

---

## 🧪 Testing

### Test Case 1: Same Student, Same Event
1. Student A logs in with username `'john'`
2. Student A registers for Event 1 → ✅ Success
3. Student A tries to register for Event 1 again → ❌ "You are already registered"

### Test Case 2: Different Students, Same Event
1. Student A logs in with username `'john'`
2. Student A registers for Event 1 → ✅ Success
3. Student B logs in with username `'jane'`
4. Student B registers for Event 1 → ✅ Success (Different student!)

### Test Case 3: Same Student, Different Events
1. Student A logs in with username `'john'`
2. Student A registers for Event 1 → ✅ Success
3. Student A registers for Event 2 → ✅ Success (Different event!)

---

## 🔧 SQL Query Explanation

### Check Registration (Backend)
```sql
SELECT * FROM event_registrations 
WHERE event_id = ? AND student_id = ?
```

This query checks if THIS SPECIFIC student (student_id) has registered for THIS SPECIFIC event (event_id).

**Why it works:**
- `event_id = ?` → Checks the event
- `student_id = ?` → Checks the student
- Both must match → Only blocks if SAME student + SAME event

### Insert Registration (Backend)
```sql
INSERT INTO event_registrations (event_id, student_id)
VALUES (?, ?)
```

This inserts a new registration record. The UNIQUE constraint prevents duplicates.

---

## 📝 Files Modified

1. **`src/pages/StudentLogin.js`**
   - Added: Save username to localStorage on login
   - Added: Save authentication state

2. **`src/pages/StudentDashboard.js`**
   - Fixed: Generate unique username if not found
   - Fixed: Use actual logged-in username

3. **`backend/controllers/eventController.js`**
   - Added: Debug logging
   - Improved: Error messages

---

## ✅ Verification Checklist

- [x] Username saved on login
- [x] Unique username generated if missing
- [x] Backend checks both event_id AND student_id
- [x] Database UNIQUE constraint on (event_id, student_id)
- [x] Multiple students can register for same event
- [x] Same student blocked from duplicate registration

---

## 🎉 Result

**Before:** Only one student could register per event  
**After:** Multiple students can register for the same event ✅

**Rules:**
- ❌ Same student + same event → NOT allowed
- ✅ Different student + same event → ALLOWED
- ✅ Same student + different event → ALLOWED

---

## 🚨 Important Notes

1. **Each student must log in with a unique username** for this to work properly
2. **If students share the same username**, they will be treated as the same student
3. **The backend validation is correct** - it checks both event_id and student_id
4. **The database constraint prevents duplicates** at the database level

---

## 🔍 Debugging

If you still see issues:

1. **Check browser console** - Look for the username being sent
2. **Check backend console** - Look for registration logs
3. **Check database:**
   ```sql
   SELECT * FROM students;
   SELECT * FROM event_registrations;
   ```
4. **Verify usernames are unique** in the students table

---

## 📊 Example Data Flow

### Student A Registration:
```
Frontend: { username: 'john', name: 'john', ... }
Backend: Finds/creates student with username='john' → student_id=1
Database: INSERT INTO event_registrations (event_id=1, student_id=1)
Result: ✅ Success
```

### Student B Registration (Same Event):
```
Frontend: { username: 'jane', name: 'jane', ... }
Backend: Finds/creates student with username='jane' → student_id=2
Database: INSERT INTO event_registrations (event_id=1, student_id=2)
Result: ✅ Success (Different student_id!)
```

---

The system now correctly allows multiple students to register for the same event! 🎉


