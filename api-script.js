
import { google } from 'googleapis';

async function getAppsScript() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/script.projects',
        'https://www.googleapis.com/auth/drive.file'
      ]
    });
    
    const authClient = await auth.getClient();
    const script = google.script({ version: 'v1', auth: authClient });
    
    const response = await script.projects.get({
      scriptId: '13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh'
    });
    
    console.log('Script content:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAppsScript();
