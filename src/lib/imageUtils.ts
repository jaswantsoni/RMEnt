// Convert Google Drive image URLs to publicly accessible format with size optimization
export function convertDriveImageUrl(driveUrl: string, size: number = 800): string {
  if (!driveUrl || !driveUrl.includes('drive.google.com')) {
    return driveUrl || '/placeholder.svg';
  }

  // Extract file ID from various Drive URL formats
  let fileId = '';
  
  if (driveUrl.includes('/file/d/')) {
    fileId = driveUrl.split('/file/d/')[1].split('/')[0];
  } else if (driveUrl.includes('id=')) {
    fileId = driveUrl.split('id=')[1].split('&')[0];
  }
  
  if (fileId) {
    // Use thumbnail URL with optimized size
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }
  
  return '/placeholder.svg';
}