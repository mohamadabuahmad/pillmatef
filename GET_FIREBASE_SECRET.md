# How to Get Firebase Database Secret (Fix Error -120)

## 🔴 Error -120: Missing Required Credentials

This error means the Arduino code needs a **Database Secret** to authenticate with Firebase.

## ✅ Solution: Get Database Secret

### Method 1: From Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Select your project: **pillmate-cc6cd**

2. **Get Database Secret**
   - Click on **⚙️ Project Settings** (gear icon, top left)
   - Go to **Service Accounts** tab
   - Scroll down to **Database secrets**
   - Click **Show** next to the secret
   - **Copy the secret** (it's a long string)

3. **Alternative Method (If above doesn't work):**
   - Go to **Realtime Database** → **Data** tab
   - Click the **three dots (⋮)** menu at the top
   - Select **Show Secret** (if available)
   - Copy the secret

### Method 2: Generate New Secret

If you can't find the secret:

1. Go to **Project Settings** → **Service Accounts**
2. Under **Database secrets**, click **Add secret**
3. Give it a name (e.g., "Arduino Device")
4. Click **Add**
5. **Copy the new secret**

---

## 📝 Update Arduino Code

1. **Open** `m5stack_pillmate.ino` in Arduino IDE

2. **Find this line:**
   ```cpp
   #define FIREBASE_AUTH "YOUR_DATABASE_SECRET_HERE"
   ```

3. **Replace** `YOUR_DATABASE_SECRET_HERE` with your actual secret:
   ```cpp
   #define FIREBASE_AUTH "your-actual-secret-here"
   ```

4. **Example:**
   ```cpp
   #define FIREBASE_AUTH "AIzaSyBBcVtzSBPGNq9CmbDEnuGUkkIg9iuApQY"
   ```
   (This is just an example - use YOUR actual secret!)

5. **Save** and **Upload** to M5Stack

---

## ⚠️ Important Notes

- **Keep the secret private!** Don't share it publicly
- The secret is used for authentication - anyone with it can access your database
- If you accidentally share it, generate a new one
- The secret is different from your API key

## 🔒 Security

After getting the secret working, make sure your Firebase rules are set correctly:

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

For production, use more secure rules (see `firebase-rules.json`).

---

## ✅ Verification

After updating the code:

1. Upload to M5Stack
2. Open Serial Monitor (115200 baud)
3. Look for:
   - ✅ `Firebase initialized successfully!`
   - ✅ `Device registered in Firebase successfully!`
   - ❌ If you still see error -120, the secret is wrong

---

## 🆘 Still Having Issues?

1. **Double-check the secret** - Make sure you copied it completely
2. **No extra spaces** - The secret should be one continuous string
3. **Quotes are correct** - Use double quotes: `"secret"`
4. **Check Serial Monitor** - It will tell you if the secret is configured

The code will now check if the secret is set and show an error on the M5Stack screen if it's not configured!

