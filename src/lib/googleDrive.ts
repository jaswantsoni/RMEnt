// Google Drive API integration
export async function searchDriveForImage(
  product: any,
  accessToken: string,
  onLog?: (message: string) => void
): Promise<string | null> {
  try {
    const sku = product.sku || product.SKU || product.id || product.ID;
    const productName = product.name || product.productName;
    
    onLog?.(`🔍 Searching for: SKU=${sku}, Name=${productName}`);
    
    const query = `(mimeType contains 'image/jpeg' or mimeType contains 'image/jpg' or mimeType contains 'image/png')`;
    
    onLog?.(`📡 Fetching images from Google Drive...`);
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,parents)&pageSize=1000`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    console.log(" data :",data)

    onLog?.(`📡 Fetched ${data.files?.length || 0} images from Google Drive`);
    onLog?.(`📁 Found ${data.files?.length || 0} total images`);
    
    if (data.files && data.files.length > 0) {
      onLog?.(`🔎 Filtering matches for SKU: ${sku}`);
      
      const allMatches = data.files.filter((file: any) => {
        const fileName = file.name.toLowerCase();
        if (sku) {
          const match = fileName.includes(sku.toLowerCase()) || 
                       fileName.startsWith(sku.toLowerCase()) ||
                       fileName.match(new RegExp(`\\b${sku.toLowerCase()}\\b`)) ||
                       fileName.match(new RegExp(`${sku.toLowerCase()}[-._]`)) ||
                       fileName.match(new RegExp(`[-._]${sku.toLowerCase()}[-._]`));
          if (match) onLog?.(`✅ Match found: ${file.name}`);
          return match;
        }
        if (productName) {
          const match = fileName.includes(productName.toLowerCase());
          if (match) onLog?.(`✅ Name match: ${file.name}`);
          return match;
        }
        return false;
      });
      
      onLog?.(`🎯 Total matches: ${allMatches.length}`);
      
      if (allMatches.length > 0) {
        const hdVersion = allMatches.find((f: any) => 
          f.name.toLowerCase().includes('hd')
        );
        
        const selectedFile = hdVersion || allMatches[0];
        onLog?.(`🏆 Selected: ${selectedFile.name} ${hdVersion ? '(HD)' : ''}`);
        
        return `https://drive.google.com/uc?export=view&id=${selectedFile.id}`;
      } else {
        onLog?.(`❌ No matches found for SKU: ${sku}`);
      }
    }
    
    return null;
  } catch (error) {
    onLog?.(`💥 Error: ${error}`);
    console.error('Error searching Google Drive:', error);
    return null;
  }
}

export async function listDriveFolders(
  accessToken: string,
  folderId?: string
): Promise<any[]> {
  try {
    const query = folderId
      ? `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder'`
      : "mimeType='application/vnd.google-apps.folder'";

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing folders:', error);
    return [];
  }
}
