// Google Drive storage utilities
const PRODUCTS_FILE_NAME = 'azzaro_products.json';

export async function saveProductsToDrive(products: any[], accessToken: string): Promise<boolean> {
  try {
    // First, check if file exists
    const existingFile = await findProductsFile(accessToken);
    
    const jsonData = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    if (existingFile) {
      // Update existing file
      const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: blob,
      });
      return response.ok;
    } else {
      // Create new file
      const metadata = {
        name: PRODUCTS_FILE_NAME,
        parents: ['root']
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', blob);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Error saving to Drive:', error);
    return false;
  }
}

export async function loadProductsFromDrive(accessToken: string): Promise<any[]> {
  try {
    const file = await findProductsFile(accessToken);
    if (!file) return [];

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const jsonData = await response.text();
      return JSON.parse(jsonData);
    }
    return [];
  } catch (error) {
    console.error('Error loading from Drive:', error);
    return [];
  }
}

async function findProductsFile(accessToken: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${PRODUCTS_FILE_NAME}'&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
  } catch (error) {
    console.error('Error finding file:', error);
    return null;
  }
}