import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// extract public id from cloudinary url
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

// upload file to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the image to Cloudinary while have filepath
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "videoTube", // separate folder name in your cloudinary account
    });
    // file uploaded successfully
    console.log("✅ File uploaded to Cloudinary:", response.url);
    // console.log(response);
    fs.unlinkSync(localFilePath); // remove the file from local uploads/ folder after successful upload to cloudinary
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the file from local uploads/ folder while error occurs the uploading to cloudinary
  }
};

// delete file from cloudinary
const deleteFromCloudinary = async (publicId)=>{
  try {
    if(!publicId) return null;
    // delete the image from Cloudinary using public id
    const response = await cloudinary.uploader.destroy(publicId,{
      invalidate: true,
    });
    console.log("✅ File updated and old is deleted from Cloudinary:", response);
    return response;
  } catch (error) {
    console.error("❌ Error deleting file from Cloudinary:", error);
    return null;
  }
}

export {
  uploadOnCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl
};
