import React, { useState } from "react";
import { useCreateTokenSale } from "../../../hooks/useCreateTokenSale";
import SuccessModal from "./SuccessModal";
import { useHint } from "./HintContext";
import styles from "./tokenForm.module.css";
import rowStyeles from "../inputRow.module.css";
import btnStyles from "../button.module.css";
import { usePositiveNumberInput } from "../../../utils/validation";

export default function SaleForm({
  symbol,
  tokenType,
  treasuryCapId,
  refreshSaleList,
  refreshTokens,
}) {
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
    "Burn Ratio Scaled: The price increases based on the ratio of tokens burned in previous stages. Set pricing param = 1 to use actual ratio, pricing param < 1 to decrease and pricing param > 1 to increase.",
    "Sold Ratio Scaled: The price increases based on the ratio of tokens sold in previous stages. Set pricing param = 1 to use actual ratio, pricing param < 1 to decrease and pricing param > 1 to increase.",
  ];

  // Form fields
  const price = usePositiveNumberInput("");
  const hardCap = usePositiveNumberInput("");
  const reservePercentage = usePositiveNumberInput("");
  const numberOfStages = usePositiveNumberInput("");
  const stageDuration = usePositiveNumberInput("");
  const increment = usePositiveNumberInput("");

  const [priceMode, setPriceMode] = useState("");
  const [burnMode, setBurnMode] = useState(false);
  const { setHint, handleBlur } = useHint();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputs = [
      price,
      hardCap,
      reservePercentage,
      numberOfStages,
      stageDuration,
      ...(priceMode !== 0 ? [increment] : []),
    ];

    const allValid = inputs.every(
      (field) => field.isValid && field.value !== ""
    );

    if (!allValid) {
      inputs.forEach((field) => field.onBlur());
      return;
    }

    const SCALE = 1e9;
    const toFixed = (v) => Math.round(parseFloat(v) * SCALE);

    const basePrice = toFixed(price.value);
    const priceParam = priceMode === 0 ? 0 : toFixed(increment.value);

    const finalMode = burnMode ? 1 : 0;

    console.log({
      basePriceInput: price.value,
      parsedBasePrice: toFixed(price.value),
      priceParamInput: increment.value,
      parsedPriceParam: toFixed(increment.value),
    });

    await createSale({
      treasuryCapId,
      tokenType,
      hardCap: Number(hardCap.value),
      reservePercentage: Number(reservePercentage.value),
      basePrice,
      numberOfStages: Number(numberOfStages.value),
      stageDuration: Number(stageDuration.value),
      selectedPriceMode: priceMode,
      priceParam: Number(priceParam),
      finalMode,
    });
  };

  const reset = () => {
    price.setValue("");
    hardCap.setValue("");
    reservePercentage.setValue("");
    numberOfStages.setValue("");
    stageDuration.setValue("");
    increment.setValue("");
    setBurnMode(false);
    setResult(null);
  };

  return (
    <div className={styles.dashboardForm}>
      <form className={styles.formBlock} onSubmit={handleSubmit}>
        <h4>
          Setup Sale for <code>{symbol}</code>
        </h4>
        <label htmlFor="base-prise">
          <code>Base price</code>
        </label>
        <input
          id="base-price"
          placeholder="Base Price (e.g. 0.01)"
          value={price.value}
          onChange={price.onChange}
          onFocus={() =>
            setHint(
              "Enter your token price. Price is set in SUI, and will be used as the base price for the first stage. Ex: 0.01"
            )
          }
          onBlur={() => {
            price.onBlur();
            handleBlur();
          }}
          required
          className={rowStyeles.input}
        />
        {price.error && <div>{price.error}</div>}

        <label htmlFor="hard-cap">
          <code>Hard cap</code>
        </label>
        <input
          id="hard-cap"
          placeholder="Hard Cap"
          value={hardCap.value}
          onChange={hardCap.onChange}
          onFocus={() =>
            setHint(
              "Token hard cap is maximum minting allowance (even if you choose to burn unsold tokens. Recommended HardCap >= 18B (18 * 10^9). Ex: 120000000"
            )
          }
          onBlur={() => {
            hardCap.onBlur();
            handleBlur();
          }}
          required
          className={rowStyeles.input}
        />
        {hardCap.error && <div>{hardCap.error}</div>}

        <label htmlFor="reserve-percentage">
          <code>Reserve percentage</code>
        </label>
        <input
          id="reserve-percentage"
          placeholder="Reserve Percentage"
          value={reservePercentage.value}
          onChange={reservePercentage.onChange}
          onFocus={() =>
            setHint(
              "This is the percentage of the hard cap that will be reserved for the team or other purposes Ex: 10 (for 10%)."
            )
          }
          onBlur={() => {
            reservePercentage.onBlur();
            handleBlur();
          }}
          className={rowStyeles.input}
        />
        {reservePercentage.error && <div>{reservePercentage.error}</div>}

        <label htmlFor="number-stage">
          <code>Number of stages</code>
        </label>
        <input
          id="number-stage"
          placeholder="Number of Stages"
          value={numberOfStages.value}
          onChange={numberOfStages.onChange}
          onFocus={() =>
            setHint(
              "Set number of stage your token Sale will be split to. If no stages are set, the sale will be a single stage with the base price."
            )
          }
          onBlur={() => {
            numberOfStages.onBlur();
            handleBlur();
          }}
          className={rowStyeles.input}
        />
        {numberOfStages.error && <div>{numberOfStages.error}</div>}

        <label htmlFor="duration">
          <code>Stage duration</code>
        </label>
        <input
          id="duration"
          placeholder="Stage Duration (days)"
          value={stageDuration.value}
          onChange={stageDuration.onChange}
          onFocus={() =>
            setHint(
              "Set the duration of each stage in days. Ex: 30 (for 30 days). The next stage can be started once previous ends (current time + duration) or tokens sold out."
            )
          }
          onBlur={() => {
            stageDuration.onBlur();
            handleBlur();
          }}
          className={rowStyeles.input}
        />
        {stageDuration.error && <div>{stageDuration.error}</div>}

        <label>
          <code>Pricing Mode</code>
        </label>
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
          className={rowStyeles.input}
        >
          {priceModes.map((mode, idx) => (
            <option key={idx} value={idx}>
              {mode}
            </option>
          ))}
        </select>

        {priceMode !== 0 && (
          <>
            <label htmlFor="pricing-param">
              <code>Pricing param</code>
            </label>
            <input
              id="pricing-param"
              placeholder="Increment / Multiplier"
              value={increment.value}
              onChange={increment.onChange}
              onFocus={() =>
                setHint(
                  "This is the increment or multiplier for the price in the next stage. For example, if you set it to 0.01 for Fixed Step mode, the next stage will be 0.01 higher than the previous one."
                )
              }
              onBlur={() => {
                increment.onBlur();
                handleBlur();
              }}
              required
              className={rowStyeles.input}
            />
            {increment.error && <div>{increment.error}</div>}
          </>
        )}

        <label
          onMouseEnter={() =>
            setHint("Burn unsold tokens after the stage ends.")
          }
          onMouseLeave={() => setHint("Start filling data to see user hint.")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--site-gap-sm)",
            marginBottom: "var(--site-gap-lg)",
          }}
        >
          <input
            type="checkbox"
            checked={burnMode}
            onChange={(e) => setBurnMode(e.target.checked)}
          />
          <code>Burn Remaining Tokens</code>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${btnStyles.btn} ${btnStyles.btnAccent}`}
        >
          {isSubmitting ? "Submitting..." : "Launch Sale"}
        </button>
      </form>

      {result && (
        <SuccessModal
          tokenName="Sale Created"
          digest={result?.digest}
          onClose={() => {
            reset();
            refreshSaleList();
            refreshTokens();
          }}
        />
      )}
    </div>
  );
}
