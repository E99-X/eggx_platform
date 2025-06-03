import React, { useState } from "react";
import { useCreateTokenSale } from "../hooks/useCreateTokenSale";
import SuccessModal from "./SuccessModal";
import { useHint } from "./HintContext";

export default function SaleForm({ tokenType, treasuryCapId }) {
  const { createSale, isSubmitting, result, setResult } = useCreateTokenSale();
  const priceModes = [
    "Default",
    "Fixed Step",
    "Burn Ration Scaled",
    "Sold Ratio Scaled",
  ];

  const priceHint = [
    "Default: The base price is used for the first stage. If no stages are set, the sale will be a single stage with the base price.",
    "Fixed Step: The price increases by a fixed amount each stage.",
    "Burn Ratio Scaled: The price increases based on the ratio of tokens burned in previous stages.",
    "Sold Ratio Scaled: The price increases based on the ratio of tokens sold in previous stages.",
  ];

  // Form fields
  const [price, setPrice] = useState("");
  const [hardCap, setHardCap] = useState("");
  const [reservePercentage, setReservePercentage] = useState("");
  const [numberOfStages, setNumberOfStages] = useState("");
  const [stageDuration, setStageDuration] = useState("");
  const [priceMode, setPriceMode] = useState("");
  const [increment, setIncrement] = useState("");
  const [burnMode, setBurnMode] = useState(false);
  const { setHint, handleBlur } = useHint();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const SCALE = 1e9;
    const toFixed = (v) => Math.round(parseFloat(v) * SCALE);

    const finalMode = burnMode ? 1 : 0;
    const basePrice = toFixed(price);
    const priceParam = priceMode === 0 ? 0 : toFixed(increment);

    await createSale({
      treasuryCapId,
      tokenType,
      hardCap,
      reservePercentage,
      basePrice,
      numberOfStages,
      stageDuration,
      selectedPriceMode: priceMode,
      priceParam,
      finalMode,
    });
  };

  const reset = () => {
    setPrice("");
    setHardCap("");
    setReservePercentage("");
    setNumberOfStages("");
    setStageDuration("");
    setPriceMode(0);
    setIncrement("");
    setBurnMode(false);
    setResult(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Create Token Sale</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Base Price (e.g. 0.01)"
          onFocus={() =>
            setHint(
              "Enter your token price. Price is set in SUI, and will be used as the base price for the first stage. Ex: 0.01"
            )
          }
          onBlur={handleBlur}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="Hard Cap"
          onFocus={() =>
            setHint(
              "Token hard cap is maximum minting allowance (even if you choose to burn unsold tokens. Recommended HardCap >= 18B (18 * 10^9). Ex: 120000000"
            )
          }
          onBlur={handleBlur}
          value={hardCap}
          onChange={(e) => setHardCap(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="Reserve Percentage"
          onFocus={() =>
            setHint(
              "This is the percentage of the hard cap that will be reserved for the team or other purposes Ex: 10 (for 10%)."
            )
          }
          onBlur={handleBlur}
          type="number"
          value={reservePercentage}
          onChange={(e) => setReservePercentage(Number(e.target.value))}
        />
        <br />
        <input
          placeholder="Number of Stages"
          onFocus={() =>
            setHint(
              "Set number of stage your token Sale will be split to. If no stages are set, the sale will be a single stage with the base price."
            )
          }
          onBlur={handleBlur}
          type="number"
          value={numberOfStages}
          onChange={(e) => setNumberOfStages(Number(e.target.value))}
        />
        <br />
        <input
          placeholder="Stage Duration (seconds)"
          onFocus={() =>
            setHint(
              "Set the duration of each stage in days. Ex: 30 (for 30 days). The next stage can be started once previous ends (current time + duration) or tokens sold out."
            )
          }
          onBlur={handleBlur}
          type="number"
          value={stageDuration}
          onChange={(e) => setStageDuration(Number(e.target.value))}
        />
        <br />

        <label>Pricing Mode:</label>
        <select
          value={priceMode}
          onFocus={() => {
            setHint(priceHint[priceMode]);
          }}
          onChange={(e) => {
            const idx = Number(e.target.value);
            setPriceMode(idx);
            setHint(priceHint[idx]);
          }}
          onBlur={handleBlur}
        >
          {priceModes.map((mode, idx) => (
            <option key={idx} value={idx}>
              {mode}
            </option>
          ))}
        </select>

        <br />

        {priceMode !== 0 && (
          <input
            placeholder="Increment / Multiplier"
            onFocus={() =>
              setHint(
                "This is the increment or multiplier for the price in the next stage. For example, if you set it to 0.01 for Fixed Step mode, the next stage will be 0.01 higher than the previous one."
              )
            }
            onBlur={handleBlur}
            value={increment}
            onChange={(e) => setIncrement(e.target.value)}
            required
          />
        )}
        <br />

        <label
          onMouseEnter={() =>
            setHint("Burn unsold tokens after the stage ends.")
          }
          onMouseLeave={() => setHint("Start filling data to see user hint.")}
        >
          <input
            type="checkbox"
            checked={burnMode}
            onChange={(e) => setBurnMode(e.target.checked)}
          />
          Burn Remaining Tokens
        </label>
        <br />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Launch Sale"}
        </button>
      </form>

      {result && (
        <SuccessModal
          tokenName="Sale Created"
          digest={result?.digest}
          onClose={reset}
        />
      )}
    </div>
  );
}
