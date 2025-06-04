import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Button from "./Button";
import InputRow from "./InputRow";
import { SALES } from "../../constants/sales";
import styles from "./demo.module.css";

const WIDGET_SRC = "http://localhost:3001/widget.js";

let widgetScriptLoading = false;
function loadWidgetScript(onLoad) {
  if (typeof window.TokenSaleWidget === "function") {
    onLoad();
  } else if (!widgetScriptLoading) {
    widgetScriptLoading = true;
    const s = document.createElement("script");
    s.src = WIDGET_SRC;
    s.async = true;
    s.onload = onLoad;
    document.body.appendChild(s);
  }
}

export default function Home() {
  const [colors, setColors] = useState({
    primaryColor: "#dfdfdf",
    bgrColor: "#1c1c1e",
    accentColor: "#f8df00",
  });

  const [avatarUrl, setAvatarUrl] = useState(SALES[0].avatar);
  const [saleId, setSaleId] = useState(SALES[0].saleId);
  const [snippet, setSnippet] = useState("");
  const [showSnippet, setShowSnippet] = useState(false);
  const snippetRef = useRef(null);

  const isValidHex = (val) => /^#[0-9A-F]{0,6}$/i.test(val);

  useEffect(() => {
    loadWidgetScript(() => {
      const el = document.getElementById("previewWidget-1");
      if (!el || typeof window.TokenSaleWidget !== "function") return;

      el.innerHTML = "";

      const safeColors = {
        ...(isValidHex(colors.primaryColor)
          ? { primaryColor: colors.primaryColor }
          : {}),
        ...(isValidHex(colors.bgrColor) ? { bgrColor: colors.bgrColor } : {}),
        ...(isValidHex(colors.accentColor)
          ? { accentColor: colors.accentColor }
          : {}),
      };

      try {
        window.TokenSaleWidget({
          containerId: "previewWidget-1",
          customColors: safeColors,
          avatarUrl,
          saleId,
        });
      } catch (err) {
        console.error("TokenSaleWidget error:", err);
      }
    });
  }, [colors, avatarUrl, saleId]);

  const pickSale = (id) => {
    const selectedSale = SALES.find((s) => s.id === id);

    if (!selectedSale) return;

    setSaleId(selectedSale.saleId);
    setAvatarUrl(selectedSale.avatar || "");
    setColors({
      primaryColor: selectedSale.primaryColor || "#d0cfcf",
      bgrColor: selectedSale.bgrColor || "#1c1c1e",
      accentColor: selectedSale.accentColor || "#f8df00",
    });
  };

  const updateColor = (key, rawValue) => {
    let value = rawValue.replace(/[^a-fA-F0-9#]/g, "");
    value = value.replace(/#+/g, "#");
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    value = value.slice(0, 7);
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const buildSnippet = () => {
    const formatted = `
      <div id="previewWidget-1"></div>
      <script src="https://widget.e99x.com/widget.js"></script>
      <script>
        window.TokenSaleWidget({
          containerId: 'previewWidget-1',
          customColors: {
            primaryColor: '${colors.primaryColor}',
            bgrColor: '${colors.bgrColor}',
            accentColor: '${colors.accentColor}',
          },
          avatarUrl: '${avatarUrl}',
          saleId: '${saleId}',
        });
      </script>
    `;
    setSnippet(formatted);
    setShowSnippet(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (snippetRef.current && !snippetRef.current.contains(e.target)) {
        setShowSnippet(false);
      }
    };

    if (showSnippet) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSnippet]);

  return (
    <div className={styles.demo}>
      <Header
        title="Egg-X TokenSale Widget - Now on Autopilot"
        desc="Try Our Live Testnet Demo: Interact with fully deployed sales - no installation or setup required. Just switch your wallet to Testnet and start buying."
      />

      <div className={styles.demo_tabs}>
        {SALES.filter((s) => s.id !== "default" && s.id !== "error").map(
          (s) => {
            const isActive = saleId === s.saleId;
            return (
              <Button
                key={s.id}
                onClick={() => pickSale(s.id)}
                variant={isActive ? "secondary" : "primary"}
              >
                {s.name}
              </Button>
            );
          }
        )}
      </div>

      <div className={styles.demo_panels}>
        <div
          id="previewWidget-1"
          className={styles.demo_widget}
          style={{
            backgroundColor: isValidHex(colors.bgrColor)
              ? colors.bgrColor
              : "#1c1c1e",
          }}
        />

        <div className={styles.demo_info}>
          <div className={styles.demo_header}>
            <h3>Build Your Own</h3>
            <p>
              Head to our{" "}
              <a
                href="https://github.com/E99-X/user_coin_on_eggx"
                target="_blank"
                rel="noopener noreferrer"
                className="demo_githubLink"
              >
                Github
              </a>
              , deploy your token & create a sale via CLI, then return here to
              watch it live in the widget.
            </p>
          </div>

          <div className={styles.demo_fields}>
            {["primaryColor", "bgrColor", "accentColor"].map((k) => (
              <InputRow
                key={k}
                label={k}
                value={colors[k]}
                placeholder="#"
                onChange={(val) => updateColor(k, val)}
              />
            ))}
            <InputRow
              label="avatarUrl"
              value={avatarUrl}
              onChange={setAvatarUrl}
              placeholder="https://..."
            />
            <InputRow label="saleId" value={saleId} onChange={setSaleId} />
          </div>

          <Button variant="primary" onClick={buildSnippet}>
            Get your widget
          </Button>
          <div className={styles.demo_header}>
            <h3>Manage Token Sale</h3>
            <p>
              Connect your deployer wallet to unlock the built-in Admin panel.
              Manage stages, and oversee your sale directly from the widget.
            </p>
          </div>
          {showSnippet && (
            <div className={styles.demo_snippet} ref={snippetRef}>
              <textarea
                readOnly
                rows={12}
                value={snippet}
                className={styles.demo_code}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
