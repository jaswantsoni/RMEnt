# Excel Upload & Google Drive Integration Setup Guide

## Overview
This system allows you to:
1. Upload Excel files with product data
2. Automatically match products with images from Google Drive
3. Display products on your website

## Step 1: Get Google Drive API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API Key

5. Create OAuth 2.0 Client:
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins"
   - Copy the Client ID

## Step 2: Setup Your Excel File

Your Excel file should have columns like:
- `name` or `productName` - Product name
- `price` - Product price
- `description` - Product description
- `category` - Product category
- `sku` - Product SKU

## Step 3: Organize Google Drive Images

1. Upload product images to Google Drive
2. Name images to match product names (e.g., "Crystal Chandelier.jpg")
3. Make sure images are in JPG/PNG format
4. Note the folder ID if you want to search in specific folder

## Step 4: Use the Admin Panel

1. Go to `/admin` on your website
2. **Google Drive Setup Tab:**
   - Enter your Client ID and API Key
   - Optionally enter folder ID
   - Click "Save Configuration"
   - Click "Connect to Google Drive"

3. **Upload Excel Tab:**
   - Choose your Excel file
   - Wait for processing

4. **Match Images Tab:**
   - Click "Match Images from Drive"
   - Wait for automatic matching

## Step 5: Export and Use

- Click "Save" to store in localStorage
- Click "Export JSON" to download product data
- Products are now ready to display on your website

## Troubleshooting

- **Authentication fails**: Check Client ID and API Key
- **Images not found**: Ensure image names match product names
- **Excel parsing fails**: Check column names and data format

## Security Notes

- API keys are stored in localStorage (client-side only)
- For production, consider server-side implementation
- Regularly rotate API keys for security