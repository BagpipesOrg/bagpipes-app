---

# ![Bagpipes Logo](https://drive.google.com/uc?export=download&id=1t9QlFCEGjh5KJqU4s8RGfLCeYFC2SZBS) Bagpipes.io
![GitHub deployments](https://img.shields.io/github/deployments/XcmSend/xcmsend-ui/production?logo=vercel&link=https%3A%2F%2Fapp-v0-0-1.vercel.app)
![Discord](https://img.shields.io/discord/1155878499240914944?logo=discord&link=https%3A%2F%2Fdiscord.gg%2FfJYcgrB2F)
![Docusaurus - Docusaurus](https://img.shields.io/badge/Docusaurus-Docusaurus-blue?logo=docusaurus&logoColor=white&style=flat-square)
![Polkadot](https://img.shields.io/badge/polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

---

## 🚀 Introduction

Welcome to the Bagpipes SDK, a no-code platform for Web3 development. Our platform simplifies the creation and management of decentralized applications.

This monorepo contains the core SDK and packages that make up Bagpipes.io, including reusable libraries and components.

## 📚 Documentation

Find our docs at:
[Bagpipes.io Documentation](https://docs.bagpipes.io/)

## 🌐 Live Instance (Experimental)

Check out our live instance at:
[alpha.bagpipes.io](https://builder.bagpipes.io)
_We are still in an experimental stage, so be prepared for bugs_

## 🏗️ Monorepo Structure
The monorepo is organized using Yarn Workspaces and contains the following packages under the packages/ directory:

- chains-lib (@bagpipes/chains): Shared utilities and helpers for blockchain interactions. This library can be used independently.
- wallet (@bagpipes/wallet): An MVP wallet that serves as a placeholder, built using the Sub Wallet template.
- client: The main web3 no-code builder application that brings everything together.

## 🛠️ Getting Started

### Prerequisites
- Node.js (version >= 20.x.x)
- Yarn (version >= 1.22.x)

### Installation
Clone the repository and install dependencies:

```shell
git clone git@github.com:XcmSend/app.git
cd app
yarn
```

### Development
To start the development server:

```shell
yarn dev
```

This will start the Vite development server, and your application should be accessible at http://localhost:5173.

### Developing Packages
When making changes in either chains-lib or wallet, you need to rebuild those packages for changes to reflect in the development server.

### Building Packages
To build a package after making changes:

Follow these steps to build and run the application locally:


```shell
# Build chains-lib
yarn workspace @bagpipes/chains build

# Build wallet
yarn workspace @bagpipes/wallet build
```


Alternatively, to build all packages at once:

```shell
yarn build-workspaces
```


After building, you do not necessarily need to restart the development server. Vite can pick up the changes if configured correctly.

### Setting Up Automatic Rebuilding
To avoid manually rebuilding packages and restarting the dev server, you can set up watch scripts to automatically rebuild the packages on changes.

In separate terminals, run:

```shell
# Watch chains-lib for changes and rebuild automatically
yarn workspace @bagpipes/chains watch

# Watch wallet for changes and rebuild automatically
yarn workspace @bagpipes/wallet watch
```


## Building for Production
To build the application for production:

```shell
yarn build
```

This will build all packages and the client application.
## ⚖️ License

Bagpipes is licensed under the Bagpipes license. See [LICENSE.md](LICENSE.md) for more details.

## 📞 Community & Support

Feel free to join our Discord community if you need any support or want to discuss ideas:
[![Discord](https://img.shields.io/discord/1155878499240914944?logo=discord&link=https%3A%2F%2Fdiscord.gg%2FfJYcgrB2F)](https://discord.gg/fJYcgrB2F)

## 👥 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn how you can help.

---

Feel free to reach out to us if you have any questions or need further assistance. Happy Bagpiping! 🎉

---


📂 Repository Structure Overview
Here's an overview of the repository structure:

```ruby
app/
├── packages/
│   ├── chains-lib/        # @bagpipes/chains
│   │   ├── src/           # Source code for chains-lib
│   │   └── package.json
│   ├── wallet/            # @bagpipes/wallet
│   │   ├── src/           # Source code for wallet
│   │   └── package.json
│   └── client/            # Main client application
│       ├── src/           # Source code for client
│       └── package.json
├── node_modules/
├── package.json            # Root package.json with Yarn Workspaces
├── yarn.lock
├── vite.config.js          # Vite configuration
└── README.md 
```