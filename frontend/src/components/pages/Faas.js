// components/pages/Faas.js
import React from "react";
import Header from "./Header";
import List from "./List";
import Card from "./Card";
import styles from "./mvp.module.css";

const Faas = () => {
  return (
    <div className={styles.mvp}>
      <Header
        title="Egg-X turns memecoin chaos into protocol-grade sales"
        desc="FaaS (Features as a Service) is Egg-X modular product model for on-chain token sales. From protocol logic and automation to SDKs and drop-in UI, each feature is designed to be used independently or combined into complete launch stacks - customizable, composable, and fully on-chain."
      />

      <section className={styles.cards}>
        <Card title="Flexible Sale Models">
          <p className="threelines">
            Support for multiple fundraising models, from public IDOs to
            softcap-based campaigns.
          </p>
          <List
            variant="check"
            items={[
              "Softcap enforcement with automatic refunds (Kickstarter-style)",
              "Public IDO-style launches with flat or dynamic pricing",
              "Creator-defined parameters for vesting, access, and stages",
            ]}
          />
        </Card>

        <Card title="KOL & Referral Engine">
          <p className="threelines">
            Built-in marketing incentives to expand project reach through
            community-led sharing.
          </p>
          <List
            variant="check"
            items={[
              "Creator-configurable referral fee split",
              "Multisig-based KOL partnerships",
              "Verified KOL registry for public trust",
            ]}
          />
        </Card>

        <Card title="Automation & Triggers">
          <p className="threelines">
            Automated execution of token sale logic based on conditions, time,
            or external signals.
          </p>
          <List
            variant="check"
            items={[
              "Cron-triggered sale advancement and scheduler",
              "Composable with DePIN and oracle-based triggers",
              "Enables auto-swap, distribution, rewards, and vesting flows",
            ]}
          />
        </Card>

        <Card title="Token Utilities & Wrappers">
          <p className="threelines">
            Expand token functionality with NFT/SFT formats and asset wrappers.
            Unlock new post-sale revenue options.
          </p>
          <List
            variant="check"
            items={[
              "Creator-defined parameters for vesting, access, and stages",
              "Wrap physical or bridged assets into token form",
              "Enable pre-sale, resale, and token-based payments for products or services",
            ]}
          />
        </Card>

        <Card title="Widget Builder">
          <p className="threelines">
            Embeddable Sale Widgets to host token sales anywhere on the web.
          </p>
          <List
            variant="check"
            items={[
              "Theme packs, presets, and display customization",
              "Wallet-aware admin detection",
              "Referral links and advanced settings through Dashboard",
            ]}
          />
        </Card>

        <Card title="SDKs & Launchpad Integration">
          <p className="threelines">
            Developer-first tools to build, scale, and white-label your own sale
            flow.
          </p>
          <List
            variant="check"
            items={[
              "Token creation + sale launcher helpers",
              "B2B integration support with registry sync",
              "Hooks for custom dashboards or mobile apps",
            ]}
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className="site-text-primary">Why FaaS Wins</h2>
        <div className={styles.split}>
          <div>
            <h4 className="site-text-accent">Win for Creators</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Launch anywhere",
                  sub: "Own your token lifecycle — no lock-in, no gatekeeping.",
                },
                {
                  label: "Monetize deeply",
                  sub: "Turn loyalty, utility, and partners into on-chain value flows.",
                },
              ]}
            />
          </div>

          <div>
            <h4 className="site-text-accent">Win for Communities</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "Back what matters",
                  sub: "Softcap logic and verified badges reduce risk.",
                },
                {
                  label: "Get rewarded",
                  sub: "KOL links, swaps, and claims drive direct upside.",
                },
              ]}
            />
          </div>

          <div>
            <h4 className="site-text-accent">Win for Builders</h4>
            <List
              variant="bullet"
              items={[
                {
                  label: "SDK everything",
                  sub: "From CLI sale deploy to whitelabel frontend kits.",
                },
                {
                  label: "Fully modular",
                  sub: "Use only the pieces you need. Extend anytime.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="site-text-primary textContainer">Have Feedback?</h2>
        <p className="textContainer">
          Egg-X FaaS is built to flex — and it's just getting started. If you’re
          a founder, builder, or degen with ideas, let’s talk. Drop us a line on{" "}
          <a
            href="https://x.com/eggx_"
            target="_blank"
            rel="noopener noreferrer"
            className="demo_githubLink"
          >
            X / Twitter
          </a>{" "}
          and help shape what ships next.
        </p>
      </section>
    </div>
  );
};

export default Faas;
