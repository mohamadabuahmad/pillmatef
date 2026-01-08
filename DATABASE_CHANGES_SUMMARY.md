# Database Changes Summary

## Changes Made to Match M5Stack Code

### 1. App Code Updates

#### Link Device (`app/(device)/link.tsx`)
- ✅ **Already matches**: Sets `status: "LINKED"` and `ownerUid` when linking
- ✅ **Added**: Stores device PIN in Firestore at `users/{uid}/devices/{pin}` for easy access
- ✅ **Matches M5Stack**: M5Stack checks for `status == "LINKED"` to detect linking

#### Home Page (`app/(tabs)/index.tsx`)
- ✅ **Added**: Fetches linked device PIN from Firestore
- ✅ **Added**: `triggerDispense()` function that sets `/pillmateDevices/{PIN}/dispense = true`
- ✅ **Added**: "Dispense Dose Now" button in UI (only shows when device is linked)
- ✅ **Matches M5Stack**: M5Stack checks `/pillmateDevices/{PIN}/dispense` boolean to trigger dispensing

### 2. Database Structure

#### Firebase Realtime Database (`/pillmateDevices/{PIN}/`)
```
{
  status: "WAITING_FOR_PAIR" | "LINKED" | "DISPENSING",
  ownerUid: "user-id-here",
  linkedAt: "2024-01-08T...",
  dispense: boolean,  // Set to true to trigger dispense
  laserDetected: boolean,
  lastAction: "Dose Dispensed"
}
```

#### Firestore (`users/{uid}/devices/{pin}`)
```
{
  devicePIN: "123456",
  status: "LINKED",
  linkedAt: timestamp,
  model: "M5Stack"
}
```

### 3. Firebase Rules Update

The rules in `firebase-rules.json` have been updated to allow:
- ✅ Reading devices with status "WAITING_FOR_PAIR" (for pairing)
- ✅ Reading/writing devices when user is the owner (`ownerUid` matches)
- ✅ Writing to `dispense` field when user is the owner

**Current Rules:**
```json
{
  "rules": {
    "pillmateDevices": {
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

### 4. How It Works

1. **M5Stack Setup**:
   - Generates 6-digit PIN
   - Sets `/pillmateDevices/{PIN}/status = "WAITING_FOR_PAIR"`
   - Displays PIN on screen

2. **App Linking**:
   - User enters PIN
   - App checks if device exists and status is "WAITING_FOR_PAIR"
   - App sets `status: "LINKED"` and `ownerUid: {user-id}`
   - App stores device info in Firestore for quick access

3. **M5Stack Detects Link**:
   - M5Stack checks `/pillmateDevices/{PIN}/status`
   - When status == "LINKED", displays "Device Linked!"

4. **Dispensing**:
   - App sets `/pillmateDevices/{PIN}/dispense = true`
   - M5Stack detects `dispense == true`
   - M5Stack dispenses dose and sets `dispense = false`
   - M5Stack sets `status = "DISPENSING"` then back to "LINKED"

### 5. No Breaking Changes

✅ All existing functionality remains intact
✅ Only additions were made (device storage, dispense function)
✅ Backward compatible with existing data

### 6. Testing Checklist

- [ ] Link device with PIN
- [ ] Verify device PIN is stored in Firestore
- [ ] Verify M5Stack detects linking (shows "Device Linked!")
- [ ] Click "Dispense Dose Now" button
- [ ] Verify M5Stack receives dispense command
- [ ] Verify M5Stack dispenses and resets status

