import React, { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useCreateToken } from "../../../hooks/useCreateToken";
import SuccessModal from "./SuccessModal";
import { useHint } from "./HintContext";
import styles from "./tokenForm.module.css";
import btnStyles from "../button.module.css";
import rowStyles from "../inputRow.module.css";

export default function TokenForm({ refreshTokens }) {
  const account = useCurrentAccount();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { setHint, handleBlur } = useHint();

  const { createToken, isProcessing, deployResult, resetResult } =
    useCreateToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return alert("Connect wallet first");
    if (!imageUrl) return alert("Provide an image URL");

    try {
      await createToken({
        address: account.address,
        name,
        symbol,
        description,
        imageUrl,
      });
    } catch (err) {
      console.error("❌ createToken failed", err);
      alert("Something went wrong");
    }
  };

  const createPreviewUrl = (image_url) => {
    return image_url.length > 20 ? image_url.slice(0, 20) + "..." : image_url;
  };

  const handleReset = () => {
    resetResult();
    setName("");
    setSymbol("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div className={styles.dashboardForm}>
      <div className={styles.formBlock}>
        <label htmlFor="token-image-url">
          <code>Image URL</code>
        </label>
        <input
          id="token-image-url"
          placeholder="https://example.com/image.png"
          onFocus={() =>
            setHint(
              <>
                Paste a public URL for your token image. Upload your image to{" "}
                <a
                  href="https://www.pinata.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.hintLink}
                >
                  Pinata
                </a>{" "}
                |{" "}
                <a
                  href="https://web3.storage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.hintLink}
                >
                  Web3.storage
                </a>{" "}
                or other IPFS storage.
              </>
            )
          }
          onBlur={handleBlur}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className={rowStyles.input}
        />
      </div>
      {imageUrl ? (
        <div className={styles.preview}>
          <img
            src={imageUrl}
            alt="Token Preview"
            className={styles.imagePreview}
          />
          <code>{createPreviewUrl(imageUrl)}</code>
        </div>
      ) : (
        <p className={styles.placeholderText}>No image URL provided</p>
      )}

      <form onSubmit={handleSubmit} className={styles.formBlock}>
        <label htmlFor="token-name">
          <code>Token Name</code>
        </label>
        <input
          id="token-name"
          maxLength={30}
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
          maxLength={20}
          onFocus={() => setHint("Symbol: Short uppercase ticker, e.g., EGGX.")}
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
          onFocus={() => setHint("A short description of the token’s purpose.")}
          onBlur={handleBlur}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className={rowStyles.input}
        />

        <button
          type="submit"
          disabled={isProcessing}
          className={`${btnStyles.btn} ${btnStyles.btnAccent} ${styles.marginTop}`}
        >
          {isProcessing ? "Creating..." : "Create & Deploy Token"}
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
  );
}
