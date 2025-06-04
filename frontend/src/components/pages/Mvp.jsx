import React from "react";
import Header from "./Header";
import List from "./List";
import Card from "./Card";
import styles from "./mvp.module.css";

const Mvp = () => {
  return (
    <div className={styles.mvp}>
      <Header
        title="Egg-X MVP Overview"
        desc="Modular token sales protocol built on Sui. Live on Testnet."
      />

      <section className={styles.section}>
        <h2 className="site-text-primary  textContaine">Core Architecture</h2>
        <p className="textContainer">
          EggX is a modular protocol, automation layer, and UI kit for
          composable, on-chain token sales. It powers fully on-chain, flexible
          token sales with composable features and minimal integration effort.
          Designed for developers and projects that demand verifiable,
          decentralized token distribution logic.
        </p>
      </section>

      <section className={styles.cards}>
        <Card title="Core Protocol & Autopilot">
          <p className="fourlines">
            The core smart contract system that defines token sales as on-chain
            objects. Built for flexibility and safety-first logic.
          </p>
          <List
            variant="check"
            items={[
              "Encapsulated, composable stage logic",
              "Typed token-bound objects",
              "Admin-controlled permissions",
              "Global autopilot registry",
            ]}
          />
        </Card>

        <Card title="Dashboard & Playground">
          <p className="fourlines">
            Egg-X Platform - from 1-Click token deployment to live sales
            previews and fully customizable, independently hosted widgets.
          </p>
          <List
            variant="check"
            items={[
              "Deploy own token contract in 1 click",
              "Preview all tokens and sales",
              "Create Token Sale in 1 click",
              "Customize widget colors, avatar, and get embed script",
            ]}
          />
        </Card>

        <Card title="TokenSale Widget">
          <p className="fourlines">
            A no-setup, embeddable React widget for displaying and managing
            on-chain sales. Fully integrated with the Egg-X protocol and
            Autopilot.
          </p>
          <List
            variant="check"
            items={[
              "Admin panel auto-detected via wallet",
              "Color & avatar customization",
              "Live stats & timer",
              "No backend required",
            ]}
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className="site-text-primary">Protocol Logic</h2>
        <div className={styles.split}>
          <div>
            <h4 className="site-text-accent">Finalization Modes</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Triggered",
                  sub: "Automatically finalizes when time expires.",
                },
                {
                  label: "Burn",
                  sub: "Unsold tokens are permanently removed at stage end.",
                },
                {
                  label: "Join to Pool",
                  sub: "Unsold tokens are merged into a reserve pool for later use.",
                },
              ]}
            />
          </div>
          <div>
            <h4 className="site-text-accent">Price Modes</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Fixed Price",
                  sub: "Static price remains the same for each stage.",
                },
                {
                  label: "Fixed Step Increment",
                  sub: "Each stage increases the price by a fixed step.",
                },
                {
                  label: "Burn Ratio Based",
                  sub: "Price depends on burned tokens vs. hard cap ratio.",
                },
                {
                  label: "Sold Ratio Based",
                  sub: "Price adjusts based on sold tokens vs. hard cap.",
                },
              ]}
            />
          </div>
          <div>
            <h4 className="site-text-accent">Object Structure</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Stage",
                  sub: "Self-contained stage object with modular rules.",
                },
                {
                  label: "Sale Config",
                  sub: "Lightweight metadata for global registry and sale history tracking",
                },
                {
                  label: "Admin Config",
                  sub: "Persistent data tied to the deployer, e.g., badges, verified status.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="site-text-primary">Object Model</h2>
        <p className="textContainer">
          Each token sale is an on-chain object uniquely typed by its token. It
          includes a <code>SaleConfig</code> struct for metadata and stage
          parameters. Access control is enforced via capability objects like{" "}
          <code>AdminCap</code> and granted <code>Helper</code> objects,
          ensuring only authorized actors can configure or modify stages.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className="site-text-primary">What’s Next</h2>
        <div className={styles.split}>
          <div>
            <h4 className="site-text-accent">Mainnet Deployment</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Mainnet Rollout",
                  sub: "Full deployment of Egg-X Protocol on the Sui mainnet with smart contracts, Autopilot, and TokenSale Widget.",
                },
                {
                  label: "EGGX Token Utility",
                  sub: "Protocol fee mechanics integrated with the native EGGX token.",
                },
              ]}
            />
          </div>

          <div>
            <h4 className="site-text-accent">Dashboard & Widget Builder</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Dashboard Upgrade",
                  sub: "Image loader, extended features and statistics, real-time analytics & alerts, and AI live assistant.",
                },
                {
                  label: "Widget Constructor",
                  sub: "Customizable themes, layout, branding, and data output configuration.",
                },
              ]}
            />
          </div>

          <div>
            <h4 className="site-text-accent">Enhanced Finalization Mode</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Flexible Supply Allocation",
                  sub: "Stage-specific splits of total supply across public, private, and reserve allocations.",
                },
                {
                  label: "Access Control & Vesting",
                  sub: "Private-sale-friendly with whitelisting, vesting, and soft cap-aware logic.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="site-text-primary">Live Demo</h2>
        <p className="textContainer">
          Try the fully functional testnet demo at{" "}
          <a
            href="https://e99x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="demo_githubLink"
          >
            e99x.com
          </a>
          . Use your Sui wallet on Testnet to interact with real, deployed
          sales. No setup required. Use Egg-X dashboard (on desktop) to create
          your own token and launch a TokenSale, or follow the instructions in
          our{" "}
          <a
            href="https://github.com/E99-X/user_coin_on_eggx"
            target="_blank"
            rel="noopener noreferrer"
            className="demo_githubLink"
          >
            Github
          </a>{" "}
          User manual.
        </p>
      </section>
    </div>
  );
};

export default Mvp;
