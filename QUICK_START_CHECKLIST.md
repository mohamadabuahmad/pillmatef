# 🚀 Quick Start Checklist

## ✅ Pre-Flight Checklist

### 1. Firebase Realtime Database Rules (REQUIRED!)
- [ ] Open Firebase Console: https://console.firebase.google.com/
- [ ] Select project: **pillmate-cc6cd**
- [ ] Go to: **Realtime Database** → **Rules** tab
- [ ] Copy rules from `firebase-rules.json` (or `firebase-rules-simple.json` for testing)
- [ ] Paste into Rules editor
- [ ] Click **Publish**
- [ ] Wait 10-15 seconds
- [ ] Verify rules show "Published" status

### 2. Arduino Code Setup
- [ ] Open `m5stack_pillmate.ino` in Arduino IDE
- [ ] Install libraries:
  - [ ] Firebase ESP32 Client (by mobizt)
  - [ ] ArduinoJson (if not already installed)
- [ ] Verify board: **M5Stack-Core-ESP32**
- [ ] Upload code to M5Stack
- [ ] Open Serial Monitor (115200 baud) to see logs

### 3. App Code
- [ ] All app files are updated (already done ✅)
- [ ] App uses `/devices/` path (already done ✅)
- [ ] Link page ready (already done ✅)
- [ ] Home page ready (already done ✅)

---

## 🔄 First-Time Setup Flow

### Step 1: M5Stack WiFi Setup
1. [ ] Power on M5Stack
2. [ ] Device creates WiFi: `PillMate-XXXX`
3. [ ] Connect phone to `PillMate-XXXX` (password: `12345678`)
4. [ ] Open browser: `http://192.168.4.1`
5. [ ] Select your WiFi network from dropdown
6. [ ] Enter WiFi password
7. [ ] Click "Connect"
8. [ ] Wait for device to connect to WiFi
9. [ ] Device shows PIN on screen (e.g., `123456`)

### Step 2: Link Device in App
1. [ ] Open PillMate app
2. [ ] Sign in (if not already)
3. [ ] Navigate to "Link Device" page
4. [ ] Enter the 6-digit PIN from M5Stack screen
5. [ ] Click "Link Device"
6. [ ] Wait for "Device linked successfully!" message
7. [ ] M5Stack should show "LINKED!" in green

### Step 3: Test Dispense
1. [ ] Go to home page in app
2. [ ] Verify "Dispense Dose Now" button is visible
3. [ ] Click "Dispense Dose Now"
4. [ ] M5Stack should show "DISPENSING" in blue
5. [ ] M5Stack should reset and show "Device Ready"

---

## 🐛 Troubleshooting

### Problem: "Permission denied" error
**Solution**: 
- Update Firebase Realtime Database rules
- Make sure you're using `/devices/` path in rules
- Wait 10 seconds after publishing

### Problem: "Device not found"
**Solution**:
- Check M5Stack is powered on
- Verify M5Stack is connected to WiFi
- Check PIN matches what's on screen
- Check Firebase Console → Realtime Database → Data tab

### Problem: M5Stack not showing PIN
**Solution**:
- Check Serial Monitor for errors
- Verify Firebase connection
- Check WiFi is connected
- Restart M5Stack

### Problem: App can't link device
**Solution**:
- Verify device status is "WAITING_FOR_PAIR" in Firebase
- Check Firebase rules allow writing
- Make sure you're signed in to app
- Check network connection

### Problem: Dispense not working
**Solution**:
- Verify device is linked (status = "LINKED")
- Check Firebase rules allow writing to `dispense` field
- Check M5Stack Serial Monitor for errors
- Verify device is online (check `lastSeen` in Firebase)

---

## 📊 Verify Everything Works

### Firebase Console Check
1. [ ] Go to Realtime Database → Data tab
2. [ ] See `/devices/{PIN}/` with status "WAITING_FOR_PAIR" or "LINKED"
3. [ ] If linked, see `ownerUid` field populated
4. [ ] See `lastSeen` updating every 2 seconds (when linked)

### App Check
1. [ ] Link page shows available devices (if any)
2. [ ] Can enter PIN and link device
3. [ ] Home page shows "Dispense Dose Now" button (when linked)
4. [ ] Dispense button triggers device

### M5Stack Check
1. [ ] Shows PIN on screen
2. [ ] Detects linking (shows "LINKED!")
3. [ ] Responds to dispense commands
4. [ ] Updates `lastSeen` in Firebase

---

## 📝 Important Notes

- **Path**: All code uses `/devices/` (NOT `/pillmateDevices/`)
- **Status**: Must be "WAITING_FOR_PAIR" before linking
- **Rules**: Must be updated in Firebase Console
- **WiFi**: Device remembers WiFi after first setup
- **PIN**: Changes each time device restarts (if not linked)

---

## ✅ Success Criteria

You're done when:
- [x] Firebase rules updated and published
- [x] M5Stack shows PIN
- [x] App can link device
- [x] M5Stack detects linking
- [x] App can trigger dispense
- [x] M5Stack responds to dispense

**Everything is ready! Good luck! 🎉**

