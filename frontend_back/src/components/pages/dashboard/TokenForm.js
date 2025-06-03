import React, { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useCreateToken } from "../hooks/useCreateToken";
import SuccessModal from "./SuccessModal";
import { uploadToIPFS } from "../utils/ipfs";
import { useHint } from "../components/HintContext";

export default function TokenForm() {
  const account = useCurrentAccount();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { setHint, handleBlur } = useHint();

  const { createToken, isProcessing, deployResult, resetResult } =
    useCreateToken();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return alert("Connect wallet first");
    if (!imageFile) return alert("Select an image file");

    setUploading(true);

    try {
      const url = await uploadToIPFS(imageFile);
      setImageUrl(url);

      await createToken({
        address: account.address,
        name,
        symbol,
        description,
        imageUrl: url,
      });
    } catch (err) {
      console.error("❌ Upload or createToken failed", err);
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    resetResult();
    setName("");
    setSymbol("");
    setDescription("");
    setImageFile(null);
    setImageUrl("");
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Create Token</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Token Name"
          onFocus={() => setHint("This is the token name, e.g., MyToken.")}
          onBlur={handleBlur}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="Token Symbol"
          onFocus={() => setHint("Symbol: Short uppercase ticker, e.g., MTK.")}
          onBlur={handleBlur}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          onFocus={() => setHint("A short description of the token’s purpose.")}
          onBlur={handleBlur}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <input
          type="file"
          onMouseEnter={() =>
            setHint("Upload an image or logo for your token.")
          }
          onMouseLeave={() => setHint("Start filling data to see user hint.")}
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageFile && <p> {imageFile.name}</p>}
        <br />
        <button type="submit" disabled={isProcessing || uploading}>
          {uploading
            ? "Uploading..."
            : isProcessing
            ? "Creating..."
            : "Create & Deploy Token"}
        </button>
      </form>

      {deployResult && (
        <SuccessModal
          tokenName={name}
          digest={deployResult.digest}
          onClose={handleReset}
        />
      )}
    </div>
  );
}
