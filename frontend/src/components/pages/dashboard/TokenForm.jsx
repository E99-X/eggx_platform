import React, { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useCreateToken } from "../../../hooks/useCreateToken";
import SuccessModal from "./SuccessModal";
import { uploadToIPFS } from "../../../utils/ipfs";
import { useHint } from "./HintContext";
import styles from "./tokenForm.module.css";
import btnStyles from "../button.module.css";
import rowStyles from "../inputRow.module.css";
export default function TokenForm({ refreshTokens }) {
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
    <div className={styles.dashboardForm}>
      <div className={styles.formBlock}>
        <label
          className={`${btnStyles.btn} ${btnStyles.btnPrimary} ${styles.uploadLabel}`}
        >
          Upload Image
          <input
            type="file"
            onMouseEnter={() =>
              setHint("Upload an image or logo for your token.")
            }
            onMouseLeave={() => setHint("Start filling data to see user hint.")}
            accept="image/*"
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
        </label>
      </div>
      {imageFile ? (
        <p>{imageFile.name}</p>
      ) : (
        <p className={styles.placeholderText}>No file selected</p>
      )}
      <div>
        <form onSubmit={handleSubmit} className={styles.formBlock}>
          <label htmlFor="token-name">
            <code>Token Name</code>
          </label>
          <input
            id="token-name"
            maxLength={25}
            placeholder="Token Name"
            onFocus={() =>
              setHint("This is the token name, e.g., Egg-X Native Token.")
            }
            onBlur={handleBlur}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={rowStyles.input}
          />
          <label htmlFor="token-symbol">
            <code>Token Symbol</code>
          </label>
          <input
            id="token-symbol"
            placeholder="Token Symbol"
            maxLength={10}
            onFocus={() =>
              setHint("Symbol: Short uppercase ticker, e.g., EGGX.")
            }
            onBlur={handleBlur}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className={rowStyles.input}
          />
          <label htmlFor="token-description">
            <code>Description</code>
          </label>
          <textarea
            id="token-description"
            placeholder="Description"
            rows="4"
            maxLength={50}
            onFocus={() =>
              setHint("A short description of the token’s purpose.")
            }
            onBlur={handleBlur}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={rowStyles.input}
          />

          <button
            type="submit"
            disabled={isProcessing || uploading}
            className={`${btnStyles.btn} ${btnStyles.btnAccent}  ${styles.marginTop}`}
          >
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
            onClose={() => {
              handleReset();
              refreshTokens();
            }}
          />
        )}
      </div>
    </div>
  );
}
