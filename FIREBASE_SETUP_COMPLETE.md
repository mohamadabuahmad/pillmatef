# Firebase Setup - COMPLETE GUIDE

## ⚠️ CRITICAL: Update Firebase Rules Before Testing

You **MUST** update both **Firestore** and **Realtime Database** rules for the app to work!

### Part 1: Firestore Rules (Required for App)

The app uses Firestore to store user data, devices, medications, and allergies. You need to configure Firestore security rules.

#### Step 1: Go to Firestore Rules
1. Open: https://console.firebase.google.com/
2. Select your project: **pillmate-cc6cd**
3. Click **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

#### Step 2: Copy and Paste Firestore Rules
Copy the entire content from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can read and write their own devices
      match /devices/{deviceId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Users can read and write their own allergies
      match /allergies {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Users can read and write their own medications
      match /medications/{medicationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

#### Step 3: Publish Firestore Rules
1. **Delete everything** in the Rules editor
2. **Paste** the rules above
3. Click **Publish** button (top right)
4. **Wait 10-15 seconds** for rules to propagate

---

### Part 2: Realtime Database Rules (Required for Device Communication)

You **MUST** update your Firebase Realtime Database rules for the device connection to work!

#### Step 1: Go to Realtime Database Rules
1. Open: https://console.firebase.google.com/
2. Select your project: **pillmate-cc6cd**
3. Click **Realtime Database** in the left sidebar
4. Click on the **Rules** tab

#### Step 2: Copy and Paste Realtime Database Rules

**For Production (Recommended):**
Copy the entire content from `firebase-rules.json`:

```json
{
  "rules": {
    "devices": {
      "$devicePIN": {
        ".read": "data.child('status').val() == 'WAITING_FOR_PAIR' || (auth != null && data.child('ownerUid').val() == auth.uid)",
        ".write": "data.child('status').val() == 'WAITING_FOR_PAIR' || (auth != null && data.child('ownerUid').val() == auth.uid) || !data.exists()",
        "dispense": {
          ".write": "auth != null && data.parent().child('ownerUid').val() == auth.uid"
        }
      }
    }
  }
}
```

**For Quick Testing (Less Secure):**
Copy the entire content from `firebase-rules-simple.json`:

```json
{
  "rules": {
    "devices": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### Step 3: Publish Realtime Database Rules
1. **Delete everything** in the Rules editor
2. **Paste** the rules above
3. Click **Publish** button (top right)
4. **Wait 10-15 seconds** for rules to propagate

#### Step 4: Verify Both Rule Sets
- Firestore rules should show no errors
- Realtime Database rules should show no errors
- Both should show status "Published"

---

## Database Structure

### Firebase Realtime Database Path: `/devices/{PIN}/`

**Before Linking (WAITING_FOR_PAIR):**
```json
{
  "devices": {
    "123456": {
      "status": "WAITING_FOR_PAIR",
      "pin": "123456",
      "createdAt": 1234567890,
      "lastSeen": 1234567890
    }
  }
}
```

**After Linking (LINKED):**
```json
{
  "devices": {
    "123456": {
      "status": "LINKED",
      "pin": "123456",
      "ownerUid": "user-abc-123",
      "ownerEmail": "user@example.com",
      "linkedAt": "2024-01-08T10:30:00Z",
      "createdAt": 1234567890,
      "lastSeen": 1234567890,
      "dispense": false,
      "lastAction": "Dose dispensed at 1234567890"
    }
  }
}
```

### Firestore Path: `users/{uid}/devices/{pin}`

```json
{
  "devicePIN": "123456",
  "status": "LINKED",
  "linkedAt": "2024-01-08T10:30:00Z",
  "model": "M5Stack"
}
```

---

## How the Connection Flow Works

### 1. Arduino Device (M5Stack)
- ✅ Generates 6-digit PIN
- ✅ Writes to `/devices/{PIN}/` with `status: "WAITING_FOR_PAIR"`
- ✅ Displays PIN on screen
- ✅ Checks `/devices/{PIN}/status` every 2 seconds

### 2. App (React Native)
- ✅ User enters PIN
- ✅ App reads `/devices/{PIN}/` from Firebase
- ✅ Verifies `status === "WAITING_FOR_PAIR"`
- ✅ Updates to `status: "LINKED"` and adds `ownerUid`
- ✅ Saves device PIN in Firestore under user

### 3. Arduino Detects Link
- ✅ Sees `status === "LINKED"`
- ✅ Shows "LINKED!" on screen
- ✅ Starts listening for `dispense` commands

### 4. Communication
- ✅ App writes `/devices/{PIN}/dispense = true`
- ✅ Arduino reads and executes dispense
- ✅ Arduino resets `dispense = false`

---

## Testing Checklist

- [ ] Firebase rules updated and published
- [ ] Arduino code uploaded to M5Stack
- [ ] M5Stack connected to WiFi
- [ ] M5Stack shows PIN on screen
- [ ] App can read devices with status "WAITING_FOR_PAIR"
- [ ] App can link device (change status to "LINKED")
- [ ] M5Stack detects linking (shows "LINKED!")
- [ ] App can trigger dispense (`dispense = true`)
- [ ] M5Stack receives and executes dispense command

---

## Troubleshooting

### "Missing or insufficient permissions" Error (Firestore)
- **Cause**: Firestore security rules not configured
- **Fix**: 
  1. Go to Firebase Console → Firestore Database → Rules
  2. Copy rules from `firestore.rules`
  3. Paste and Publish
  4. Wait 10-15 seconds

### "Permission denied" Error (Realtime Database)
- **Cause**: Realtime Database rules not updated
- **Fix**: Update Realtime Database rules as described above and wait 10 seconds

### "Device not found" Error
- **Cause**: Device not registered in Firebase or wrong PIN
- **Fix**: 
  - Check M5Stack is powered on and connected to WiFi
  - Verify PIN matches what's on screen
  - Check Firebase Console → Realtime Database → Data tab

### "Device already linked" Error
- **Cause**: Device was previously linked
- **Fix**: 
  - If linked to your account: Already connected, no action needed
  - If linked to another account: Device needs to be reset

### Device Not Detecting Link
- **Cause**: Arduino not checking Firebase or network issue
- **Fix**:
  - Check Serial Monitor for Firebase errors
  - Verify WiFi connection on M5Stack
  - Check Firebase Console to see if status was updated

---

## Important Notes

1. **Path Changed**: We now use `/devices/` instead of `/pillmateDevices/`
2. **Status Values**: 
   - `WAITING_FOR_PAIR` = Device waiting to be linked
   - `LINKED` = Device successfully linked to user
3. **Security**: Rules allow:
   - Anyone to read devices with `WAITING_FOR_PAIR` status
   - Only owner to read/write linked devices
4. **Real-time**: Firebase Realtime Database provides instant updates
5. **Persistence**: Device PIN saved in Firestore for quick access

---

## Next Steps

1. ✅ Update Firebase rules
2. ✅ Upload Arduino code to M5Stack
3. ✅ Test device registration
4. ✅ Test app linking
5. ✅ Test dispense command

Everything is ready! Just update the Firebase rules and you're good to go! 🚀

