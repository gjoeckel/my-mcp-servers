# Apps Script Project

Google Apps Script project with clasp integration for version control and deployment.

## Setup

1. Install clasp globally:
   ```bash
   npm install -g @google/clasp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Login to Google (if needed):
   ```bash
   npm run login
   ```

## Available Scripts

- `npm run clone` - Clone the Apps Script project
- `npm run push` - Push changes to Apps Script
- `npm run pull` - Pull changes from Apps Script
- `npm run deploy` - Deploy the script
- `npm run open` - Open in Apps Script editor

## Project Structure

- `src/` - Source files for the Apps Script project
- `.clasprc.json` - Authentication configuration
- `.clasp.json` - Project configuration

## Authentication

The project includes authentication tokens for automated deployment. Make sure to keep these secure and don't commit sensitive credentials to public repositories.

## Apps Script ID

Your Apps Script ID: `13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh`

Direct link: https://script.google.com/d/13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh/edit
