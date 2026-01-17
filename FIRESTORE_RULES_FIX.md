# Quick Fix: "Missing or insufficient permissions" Error

## Problem
You're seeing this error:
```
ERROR  Error checking for linked device: [FirebaseError: Missing or insufficient permissions.]
```

## Cause
Firestore security rules are not configured. The app tries to read from `users/{uid}/devices` but doesn't have permission.

## Solution (5 minutes)

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select your project: **pillmate-cc6cd**
3. Click **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### Step 2: Copy Rules
Open the file `firestore.rules` in this project and copy all its contents.

Or copy this directly:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    // This includes all fields like allergies, allergiesCompleted, etc.
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can read and write their own devices
      match /devices/{deviceId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Users can read and write their own medications
      match /medications/{medicationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Users can read and write their own schedule (medication doses)
      match /schedule/{scheduleId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Step 3: Paste and Publish
1. **Delete everything** currently in the Rules editor
2. **Paste** the rules above
3. Click **Publish** button (top right)
4. **Wait 10-15 seconds** for rules to propagate

### Step 4: Test
1. Restart your app
2. The error should be gone!

## What These Rules Do
- ✅ Allow authenticated users to read/write their own user data (including allergies field)
- ✅ Allow users to manage their own devices
- ✅ Allow users to manage their own medications
- ✅ Allow users to manage their own schedule (medication doses)
- ✅ Prevent users from accessing other users' data

## Still Having Issues?
1. Make sure you're logged in to the app
2. Check that Firestore Database is enabled in Firebase Console
3. Verify the rules were published (should show "Published" status)
4. Wait a bit longer (sometimes takes 30 seconds to propagate)
