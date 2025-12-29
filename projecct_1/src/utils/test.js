const url = "https://res.cloudinary.com/dup3pcerj/image/upload/v1767021629/videoTube/hoblyn2awuqhjflga8ne.jpg";

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public_id.jpg
  // We need to extract: folder/public_id (without extension)
  
  const parts = url.split('/');
  console.log(parts);
  const uploadIndex = parts.indexOf('upload');
  console.log(uploadIndex);
  
  if (uploadIndex === -1) return null;
  
  // Get everything after 'upload/' and the version (v1234567890)
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
  
  // Remove file extension
  const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.')) 
                   || publicIdWithExtension;
  
  return publicId;
};

const publicId = getPublicIdFromUrl(url);
console.log(publicId); // Output: videoTube/hoblyn2awuqhjflga8ne