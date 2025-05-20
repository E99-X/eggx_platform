# EggX Widget Playground (Frontend)

A demo playground and configuration builder for the **EggX TokenSale Widget** — a fully embeddable UI for token sales, powered by the EggX protocol.

Built as a simple CRA-based React web app, this landing page allows users to:

- Preview live testnet token sales
- Customize widget appearance (colors, avatar, sale ID)
- Generate embeddable HTML snippets
- Connect as an admin to manage on-chain sales via the widget

### Live Widget Host

The production script is served from:
https://widget.e99x.com/widget.js

You can use this directly in your app or static site. See the **"Get your widget"** section below.

### Tech Stack

- Sui/Move
- **React** (Create React App)
- CSS Modules
- Stateless playground (no backend)
- EggX Protocol
- EggX Embedable Widget

### 🛠 Installation

Clone the monorepo, then run locally:

```bash
cd frontend
npm install
npm start
```

## Playground Features

Customize and preview widget behavior via form controls:

- Custom colors: primaryColor, bgrColor, accentColor

- Avatar image URL

- Sale ID from deployed testnet sale

- HTML snippet generator for embedding the widget

Each configuration renders the live widget preview.

### How to Embed the Widget

After customizing, you can generate a snippet and get with <get_your_widget> button:

```
<div id="previewWidget-1"></div>
<script src="https://widget.e99x.com/widget.js"></script>
<script>
  window.TokenSaleWidget({
    containerId: 'previewWidget-1',
    customColors: {
      primaryColor: '#...',
      bgrColor: '#...',
      accentColor: '#...',
    },
    avatarUrl: 'https://...',
    saleId: '0xabc...',
  });
</script>
```

### Setup Requirements for Admin Access

To launch your own sale and use the admin view in the widget:

✅ Complete the first two steps from our official user guide:

👉 [EggX User Coin Guide](https://github.com/E99-X/user_coin_on_eggx)

Once deployed, you'll be able to:

Connect your deployer wallet

Unlock the Admin dashboard

Manage sale stages and autopilot from within the widget

### About EggX

EggX is a protocol for modular, programmable token launches. The widget lets anyone interact with or embed live sales — with no backend required.

## ⏱️ Cron Job: TokenSale Autopilot Executor

This project includes a backend script (cron/) for executing scheduled sale logic. It checks the EggX Autopilot Registry and automatically advances any eligible sales.

🔧 Configuration:

```
SUI_RPC_URL: https://fullnode.testnet.sui.io
AUTOPILOT_REGISTRY_ID:
0xb330c1f81a15bbf76b8c41906caa42808229be75d959b03335de5dfa27e0d5ad
AUTO_PACKAGE_ID:
0xd884f7edb4b8b2fcacccc256673901d095873471bc95c1b1e9f9f0748ce28af2
```

🔐 Private Key
Uses Firebase Secret Manager:

```
firebase functions:secrets:set PRIVATE_KEY
```

### Dry Run Mode

To simulate execution without sending on-chain transactions:

```
export const DRY_RUN = "true"; // in constants.js
```

### Installation command

```
cd cron
npm install
```

### Deployment (Only way to execute)

This job runs only in the cloud on the defined schedule.
To deploy:

```
gcloud functions deploy <FUNCTION_NAME> \
  --region=<REGION> \
  --runtime=nodejs22 \
  --source=<SOURCE_DIRECTORY> \
  --entry-point=<ENTRY_FUNCTION> \
  --trigger-http \
  --allow-unauthenticated \
  --set-secrets=<SECRET_NAME>=<SECRET_RESOURCE>:latest \
  --service-account=<SERVICE_ACCOUNT_EMAIL> \
  --gen2 \
  --project=<PROJECT_ID>
```

To monitor:

```
firebase functions:log
```

### 🐛 Debug Tool (Optional)

Use this CLI utility to inspect the Autopilot Registry, view linked sales, and check readiness for finalization:

> cron/utils/debug.js

This CLI script connects to the Sui RPC, reads all dynamic fields in the Autopilot Registry, and displays key info such as:

- Sale ID, TokenType, Sale State
- Current Stage end time
- AdminCap linkage and type match validation
- Finalization readiness

To run:

```bash
cd cron
node utils/debug.js
```

### ⚠️ Testing

> Note: Local test support is disabled. Jest and local mocks were removed for clarity and simplicity.

Testing occurs through:

- [x] GitHub Actions (CI)
- [x] Cloud Function logs (`firebase functions:log`)
- [x] Actual behavior verification on-chain

> This cron job is part of the working monorepo (runs via Github actions): [eggx](https://github.com/petushka1/eggx)

---

### 💬 Feedback or Questions?

Reach out via [Twitter/X](https://x.com/eggx_) or drop an issue. We're actively building and iterating.

## License

© 2025 EggX. All rights reserved

---

Built for autopilot-powered TokenSales on Sui by the EggX team.
