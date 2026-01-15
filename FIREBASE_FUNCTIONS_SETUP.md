# Firebase Functions Setup Guide

## Overview

This guide will help you set up Firebase Cloud Functions to handle the ChatGPT API calls securely on the server.

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. OpenAI API key (get it from https://platform.openai.com/)
3. Firebase project initialized

## Step 1: Install Dependencies

Navigate to the functions folder and install dependencies:

```bash
cd functions
npm install
```

## Step 2: Set OpenAI API Key

You have two options:

### Option A: Using Firebase Functions Config (Recommended for development)

```bash
firebase functions:config:set openai.key="your_openai_api_key_here"
```

### Option B: Using Environment Variables (Recommended for production)

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to: Functions → Configuration → Environment Variables
4. Add new variable:
   - Key: `OPENAI_API_KEY`
   - Value: `your_openai_api_key_here`

## Step 3: Build Functions

```bash
cd functions
npm run build
```

This will compile TypeScript to JavaScript in the `lib/` folder.

## Step 4: Deploy Functions

Deploy the chat function to Firebase:

```bash
firebase deploy --only functions:chatWithMedicationAI
```

Or deploy all functions:

```bash
firebase deploy --only functions
```

## Step 5: Test Locally (Optional)

To test functions locally before deploying:

```bash
cd functions
npm run serve
```

This starts the Firebase emulator. You can test the function at:
`http://localhost:5001/pillmate-cc6cd/us-central1/chatWithMedicationAI`

## Troubleshooting

### Error: "OpenAI API key is not configured"

- Make sure you've set the API key using one of the methods above
- After setting, redeploy: `firebase deploy --only functions`

### Error: "Module not found"

- Run `npm install` in the functions folder
- Make sure all dependencies are installed

### Error: "TypeScript compilation failed"

- Check `functions/tsconfig.json` is correct
- Run `npm run build` to see specific errors

### Function not appearing in Firebase Console

- Make sure you've deployed: `firebase deploy --only functions`
- Check Firebase Console → Functions section

## Function Details

### Function Name

`chatWithMedicationAI`

### Authentication

- Requires user to be authenticated
- Uses Firebase Auth context

### Input

```typescript
{
  messages: Array<{role: "user" | "assistant", content: string}>,
  userMedications?: string[]
}
```

### Output

```typescript
{
  success: boolean,
  response: string
}
```

### Features

- Secure API key storage (never exposed to client)
- User authentication required
- Chat history logging to Firestore
- Medication context awareness
- Error handling and rate limiting

## Cost Considerations

- Firebase Functions: Free tier includes 2 million invocations/month
- OpenAI API: Pay per use (check pricing at https://openai.com/pricing)
- Firestore: Free tier includes 50K reads/day

## Security Notes

✅ API key is stored securely on Firebase Functions
✅ Only authenticated users can use the chat
✅ Chat history is saved per user
✅ Rate limiting handled by Firebase

## Next Steps

1. Get OpenAI API key from https://platform.openai.com/
2. Set the API key using one of the methods above
3. Deploy the function
4. Test the chat feature in your app
