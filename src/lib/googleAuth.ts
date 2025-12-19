// Google OAuth configuration with hardcoded credentials
export const GOOGLE_CONFIG = {
  clientId: '749677717078-bv6enka0qi1qifp2r6t6690rqnkliiaq.apps.googleusercontent.com',
  apiKey: 'AIzaSyCN06FG4ZDM1wwjvq5276_6or5EaBDhPG4',
  discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  scopes: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive'
};

// Admin-only auto-initialize
export async function autoInitializeGoogleAPI() {
  // Only initialize on admin pages
  if (!window.location.pathname.includes('/admin')) {
    return null;
  }
  
  try {
    await initializeGoogleAPI();
    const token = await signInToGoogle();
    return token;
  } catch (error) {
    console.error('Admin auth failed:', error);
    return null;
  }
}

let gapi: any;
let tokenClient: any;

export async function initializeGoogleAPI() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = async () => {
      gapi = (window as any).gapi;
      await gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: GOOGLE_CONFIG.apiKey,
          discoveryDocs: [GOOGLE_CONFIG.discoveryDoc],
        });
        resolve(true);
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function signInToGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scopes,
        callback: (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            resolve(tokenResponse.access_token);
          } else {
            reject('Failed to get access token');
          }
        },
      });
      tokenClient.requestAccessToken();
    };
    document.head.appendChild(script);
  });
}