import { create } from "@web3-storage/w3up-client";
import imageCompression from "browser-image-compression"; // Import image compression library

let cachedClient = null;

export async function getW3Client() {
  if (cachedClient) return cachedClient;

  const email = process.env.REACT_APP_W3_EMAIL;
  const spaceDid = process.env.REACT_APP_DID_KEY;

  if (!email) throw new Error("❌ REACT_APP_W3_EMAIL not set.");

  const client = await create();
  await client.login(email);
  console.log("✅ Logged in");

  await client.setCurrentSpace(spaceDid);
  console.log("✅ Space set:", spaceDid);

  cachedClient = client;
  return client;
}

export async function uploadToIPFS(file) {
  const client = await getW3Client();

  try {
    // Image compression options
    const options = {
      maxSizeMB: 0.1, // Max size in MB (adjust as needed)
      maxWidthOrHeight: 800, // Max width or height (adjust as needed)
      useWebWorker: true, // Use web workers for faster compression (if available)
    };

    // Compress the file
    const compressedFile = await imageCompression(file, options);

    // Upload the compressed file to Web3.Storage
    const cid = await client.uploadFile(compressedFile);
    console.log("✅ Uploaded file CID:", cid);

    // Return the URL to access the uploaded file
    return `https://w3s.link/ipfs/${cid}`;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw new Error("Failed to upload file to Web3.Storage.");
  }
}
