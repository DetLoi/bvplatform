# Cloudinary Setup for Video Deletion

## Overview
The battle deletion feature now includes automatic deletion of associated videos from Cloudinary storage when a battle is deleted from the admin panel.

## Environment Variables Required

Create a `.env` file in the server directory with the following Cloudinary credentials:

```env
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

## How to Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard at https://cloudinary.com/console
2. Navigate to the Dashboard section
3. Copy your API Key and API Secret
4. Add them to your `.env` file

## Features

### Automatic Video Deletion
- When a battle is deleted via the admin panel (`/admin?tab=battles`), the system will:
  1. Check if the battle has any uploaded videos (challenger and/or opponent videos)
  2. Extract the Cloudinary public IDs from the video URLs
  3. Delete the videos from Cloudinary storage
  4. Delete the battle from the database
  5. Return a success message with the number of videos deleted

### Error Handling
- If Cloudinary deletion fails, the battle deletion will still proceed
- Errors are logged to the console for debugging
- The API response includes information about how many videos were deleted

### Logging
The system logs the following information:
- Number of videos being deleted
- Success/failure of Cloudinary deletions
- Any errors that occur during the process

## Testing

You can test the Cloudinary deletion functionality using the test script:

```bash
cd server
node test-cloudinary-deletion.js
```

## Security Notes

- Keep your Cloudinary API credentials secure
- Never commit the `.env` file to version control
- The cloud name is hardcoded as 'dpwzysxp7' to match the existing client configuration 