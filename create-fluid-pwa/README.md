# create-fluid-pwa

🚀 **Interactive CLI to create Fluid PWA projects - The ultimate offline-first PWA framework with multiple batteries**

Similar to `create-next-app`, but specifically designed for offline-first Progressive Web Apps with the Fluid PWA framework's multiple batteries for rapid development.

## Quick Start

```bash
npx create-fluid-pwa@latest
# or
npm create fluid-pwa@latest
# or
yarn create fluid-pwa
# or
pnpm create fluid-pwa
```

## Features

### 🎨 **Interactive Terminal UI**
Beautiful, intuitive prompts powered by `@clack/prompts` with:
- Project name validation
- Template selection with descriptions
- Feature selection (batteries included)
- Styling framework choice
- Package manager preference
- Configuration summary

### 📦 **Templates**
Choose from pre-configured templates:

- **📦 Basic** - Minimal setup with essential features
- **🎯 Full Featured** - Complete setup with all batteries included
- **🛒 E-commerce** - Optimized for online stores and marketplaces
- **📊 Dashboard** - Perfect for admin panels and analytics
- **📝 Blog/CMS** - Content management and publishing
- **👥 Social Media** - Social features and user interactions

### 🔋 **Batteries (Features)**
Select from a comprehensive set of features:

- **🔐 Authentication** - User login/logout with offline support
- **🔄 Background Sync** - Automatic data synchronization
- **📢 Push Notifications** - Web push notifications support
- **📁 File Storage** - Offline file management and caching
- **⚡ Real-time Updates** - WebSocket/SSE integration
- **📈 Analytics** - Offline-first analytics tracking
- **🔒 Data Encryption** - Client-side data encryption
- **⚙️ WebAssembly** - WASM modules for performance
- **👷 Web Workers** - Background processing threads
- **🎨 UI Component Library** - Pre-built PWA-optimized components

### 🎨 **Styling Options**
- **Tailwind CSS** - Utility-first CSS framework
- **Styled Components** - CSS-in-JS styling
- **Emotion** - CSS-in-JS with excellent performance
- **Vanilla CSS** - Plain CSS with CSS modules

### 📦 **Package Managers**
- npm
- Yarn
- pnpm
- Bun

## Usage Examples

### Interactive Mode (Recommended)
```bash
npx create-fluid-pwa@latest
```

### Non-Interactive Mode (Coming Soon)
```bash
npx create-fluid-pwa@latest my-app --template full-featured --features auth,sync,push-notifications --typescript
```

## What's Generated

Your new Fluid PWA project includes:

```
my-fluid-pwa/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── lib/
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/                # PWA icons
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
└── README.md                 # Project documentation
```

## Getting Started After Creation

```bash
cd my-fluid-pwa
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your new Fluid PWA.

## Development

To work on the CLI tool itself:

```bash
git clone https://github.com/fluid-pwa/create-fluid-pwa.git
cd create-fluid-pwa
npm install
npm run dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## License

Apache-2.0 © [Harshal More](https://github.com/harshalmore31)

---

**Built with ❤️ by [Harshal More](https://github.com/harshalmore31)** 