# Arduino Firebase Connection Troubleshooting

## 🔍 Debugging Steps

### Step 1: Check Serial Monitor
1. Open Arduino IDE
2. Go to **Tools** → **Serial Monitor**
3. Set baud rate to **115200**
4. Upload code and watch the output

**What to look for:**
- `Firebase initialized successfully!` ✅
- `Device registered in Firebase successfully!` ✅
- Any error messages ❌

### Step 2: Verify Firebase Configuration

**Current Configuration:**
```cpp
#define FIREBASE_HOST "pillmate-cc6cd-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH ""  // Empty - using security rules
```

**Check:**
- [ ] Host matches your Firebase database URL
- [ ] No typos in the host name
- [ ] Database URL is correct: `https://pillmate-cc6cd-default-rtdb.asia-southeast1.firebasedatabase.app`

### Step 3: Check Firebase Rules

**CRITICAL:** Firebase rules must allow writing!

Go to: Firebase Console → Realtime Database → Rules

**For Testing (Use This First):**
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

**Click Publish and wait 10 seconds!**

### Step 4: Common Error Codes

#### Error Code: -1 (Connection Error)
**Cause:** Cannot connect to Firebase
**Solutions:**
- Check WiFi connection
- Verify Firebase host is correct
- Check internet connection
- Try ping: `ping pillmate-cc6cd-default-rtdb.asia-southeast1.firebasedatabase.app`

#### Error Code: -2 (Send Error)
**Cause:** Cannot send data to Firebase
**Solutions:**
- Check Firebase rules allow writing
- Verify path is correct: `/devices/{PIN}/`
- Check payload size (should be small)

#### Error Code: -3 (HTTP Error)
**Cause:** Firebase server error
**Solutions:**
- Check Firebase Console for service status
- Verify database is enabled
- Check if database URL is correct

#### Error Code: -4 (Not Connected)
**Cause:** Not connected to Firebase
**Solutions:**
- Wait for `Firebase.ready()` to return true
- Check `initializeFirebase()` completed successfully
- Restart device

#### Error: "Permission denied"
**Cause:** Firebase rules blocking write
**Solutions:**
- Update Firebase rules (see Step 3)
- Use simple rules for testing
- Wait 10 seconds after publishing rules

### Step 5: Test Firebase Connection Manually

Add this test function to your code (temporary):

```cpp
void testFirebaseConnection() {
  Serial.println("Testing Firebase connection...");
  
  // Test 1: Simple write
  String testPath = "/test/connection";
  if (Firebase.setString(firebaseData, testPath, "test")) {
    Serial.println("✅ Test write successful!");
    
    // Test 2: Read back
    if (Firebase.getString(firebaseData, testPath)) {
      Serial.print("✅ Test read successful: ");
      Serial.println(firebaseData.stringData());
    } else {
      Serial.print("❌ Test read failed: ");
      Serial.println(firebaseData.errorReason());
    }
  } else {
    Serial.print("❌ Test write failed: ");
    Serial.println(firebaseData.errorReason());
    Serial.print("Error code: ");
    Serial.println(firebaseData.errorCode());
  }
}
```

Call this in `setup()` after `initializeFirebase()`.

### Step 6: Verify Data in Firebase Console

1. Go to: Firebase Console → Realtime Database → Data
2. Look for: `/devices/{PIN}/`
3. Should see:
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

### Step 7: Check Network Connection

**Test WiFi:**
```cpp
void testWiFi() {
  Serial.print("WiFi Status: ");
  Serial.println(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("RSSI: ");
  Serial.println(WiFi.RSSI());
}
```

**Test Internet:**
- Device should be able to reach Firebase servers
- Check if other internet services work

### Step 8: Firebase Library Issues

**Check Library Version:**
- Firebase ESP32 Client should be version 4.4.17 or later
- ArduinoJson should be installed

**Reinstall Library:**
1. Tools → Manage Libraries
2. Search "Firebase ESP32 Client"
3. Uninstall and reinstall

### Step 9: Path Issues

**Verify Path:**
- Path should be: `/devices/{PIN}/`
- NOT: `/pillmateDevices/{PIN}/`
- NOT: `/devices/{PIN}` (missing trailing slash in some cases)

**Check in Serial Monitor:**
```
Path: /devices/123456
```

### Step 10: JSON Format Issues

**Verify JSON:**
The code creates:
```json
{
  "status": "WAITING_FOR_PAIR",
  "pin": "123456",
  "createdAt": 1234567890,
  "lastSeen": 1234567890
}
```

Check Serial Monitor for:
```
JSON to write: { ... }
```

---

## 🔧 Quick Fixes

### Fix 1: Reset Everything
1. Clear Firebase rules (use simple rules)
2. Restart M5Stack
3. Reconnect to WiFi
4. Try again

### Fix 2: Use Simple Rules
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

### Fix 3: Check Serial Output
Look for these messages:
- ✅ `Firebase initialized successfully!`
- ✅ `Device registered in Firebase successfully!`
- ❌ Any error messages

### Fix 4: Verify Firebase Host
Make sure it matches exactly:
```
pillmate-cc6cd-default-rtdb.asia-southeast1.firebasedatabase.app
```

---

## 📋 Checklist

Before reporting issues, verify:

- [ ] Serial Monitor shows Firebase initialized
- [ ] WiFi is connected
- [ ] Firebase rules are published (wait 10 seconds)
- [ ] Firebase host is correct
- [ ] Path is `/devices/{PIN}/`
- [ ] No error codes in Serial Monitor
- [ ] Firebase Console shows data (if write succeeded)

---

## 🆘 Still Not Working?

1. **Check Serial Monitor** - Copy all output
2. **Check Firebase Console** - Look at Data and Rules tabs
3. **Verify WiFi** - Device must have internet connection
4. **Test with Simple Rules** - Use permissive rules first
5. **Check Library Version** - Update Firebase ESP32 Client

The Serial Monitor output will tell you exactly what's wrong!

