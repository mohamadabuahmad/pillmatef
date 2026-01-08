# Device Connection Guide

## How to Connect Your PillMate Box to the App

### Step 1: Setup WiFi on the Device

1. **Power on your M5Stack PillMate box**
2. The device will create its own WiFi network named `PillMate-XXXX` (where XXXX is unique to your device)
3. **Connect your phone** to this WiFi network:
   - Go to your phone's WiFi settings
   - Look for `PillMate-XXXX`
   - Password: `12345678`

### Step 2: Configure Device WiFi

1. **Open a web browser** on your phone
2. Navigate to: `http://192.168.4.1`
3. You'll see a WiFi setup page
4. The page will automatically scan and show available WiFi networks
5. **Select your home WiFi network** from the dropdown list
6. **Enter your WiFi password**
7. Click **"Connect"**
8. The device will connect to your WiFi and you can close the browser

### Step 3: Get the Pairing PIN

1. After WiFi connection, the M5Stack screen will display:
   - **"Pairing Mode"**
   - A **6-digit PIN** (e.g., `123456`)
   - "Waiting for link..."

### Step 4: Link Device in the App

1. **Open the PillMate app** on your phone
2. Make sure you're **signed in**
3. Navigate to the **"Link Device"** page (or device connection screen)
4. **Enter the 6-digit PIN** shown on the M5Stack screen
5. Click **"Link Device"**
6. Wait a few seconds for the connection to complete

### Step 5: Verify Connection

1. The app will show: **"Device linked successfully!"**
2. The M5Stack screen will show: **"LINKED!"** in green
3. You'll be redirected to the home screen
4. You should now see a **"Dispense Dose Now"** button (if a device is linked)

## Troubleshooting

### Device Not Found

- Make sure the M5Stack is powered on
- Verify the device is connected to WiFi (check the M5Stack screen)
- Double-check you entered the correct 6-digit PIN
- Make sure the device status is "WAITING_FOR_PAIR" (not already linked)

### WiFi Connection Failed

- Check that your WiFi password is correct
- Make sure your WiFi network is 2.4GHz (M5Stack doesn't support 5GHz)
- Try restarting the device and going through setup again

### Permission Denied Error

- You need to update Firebase Realtime Database security rules
- Go to Firebase Console → Realtime Database → Rules
- Use the rules from `firebase-rules.json` or `firebase-rules-simple.json`
- Click "Publish" and wait 10 seconds

### Device Already Linked

- If the device shows "Already linked", it's connected to another account
- To reset: You may need to clear the device's memory or restart it
- The device will generate a new PIN on restart

## What Happens After Linking?

1. **Device Status**: Changes from `WAITING_FOR_PAIR` to `LINKED` in Firebase
2. **Device Info**: Stored in Firestore under `users/{your-uid}/devices/{pin}`
3. **Dispense Control**: You can now trigger dose dispensing from the app
4. **Real-time Sync**: Device listens for dispense commands from Firebase

## Using the Linked Device

- **Dispense Dose**: Use the "Dispense Dose Now" button on the home screen
- **Automatic Dispensing**: Set up medication schedules and the device can dispense automatically (if configured)
- **Status Monitoring**: The app can check device status and last action

## Notes

- The device **remembers WiFi credentials** after first setup
- You only need to do WiFi setup **once** (unless you change networks)
- The **PIN changes** each time the device restarts (if not linked)
- Once linked, the device stays linked until you unlink it
