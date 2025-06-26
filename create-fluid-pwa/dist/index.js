#!/usr/bin/env node
"use strict";var D=Object.create;var v=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var I=Object.getPrototypeOf,J=Object.prototype.hasOwnProperty;var z=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of R(e))!J.call(t,l)&&l!==n&&v(t,l,{get:()=>e[l],enumerable:!(r=M(e,l))||r.enumerable});return t};var p=(t,e,n)=>(n=t!=null?D(I(t)):{},z(e||!t||!t.__esModule?v(n,"default",{value:t,enumerable:!0}):n,t));var W=require("commander"),i=require("@clack/prompts"),a=p(require("chalk")),E=p(require("gradient-string"));var m=p(require("path")),c=p(require("fs-extra")),d=require("execa");var o={name:"basic",description:"Minimal setup with essential Fluid PWA features",features:["core"],dependencies:{dexie:"^4.0.11","dexie-react-hooks":"^1.1.7",uuid:"^11.1.0"},devDependencies:{"@types/uuid":"^10.0.0",tailwindcss:"^4.0.0"},scripts:{"build:package":"tsup src/lib/index.ts --format cjs,esm --dts"},files:[{path:"src/app/page.tsx",content:`'use client'

import { FluidPWAProvider, useAddItem, useGetAllItems, FluidPWAConfig } from 'fluid-pwa'
import { useState } from 'react'

const schema = {
  notes: '++localId, title, content, syncStatus, lastModifiedOffline, userId'
}

const config: FluidPWAConfig = {
  databaseName: '{{PROJECT_NAME}}',
  schema,
  version: 1,
  enableLogging: true
}

interface Note {
  title: string
  content: string
}

function NotesApp() {
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const addNote = useAddItem<Note>('notes')
  const notes = useGetAllItems<Note>('notes')

  const handleAdd = async () => {
    if (!newNote.title.trim()) return
    
    const result = await addNote(newNote)
    if (result.success) {
      setNewNote({ title: '', content: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{{PROJECT_NAME}}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Note content..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Note
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {notes?.map((note) => (
            <div key={note.localId} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {note.syncStatus}
                </span>
              </div>
              <p className="text-gray-700">{note.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(note.lastModifiedOffline).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <FluidPWAProvider config={config}>
      <NotesApp />
    </FluidPWAProvider>
  )
}`,template:!0},{path:"src/app/layout.tsx",content:`import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '{{PROJECT_NAME}}',
  description: 'A Fluid PWA application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,template:!0},{path:"src/app/globals.css",content:`@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}`},{path:"tailwind.config.js",content:`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}`},{path:"next.config.js",content:`/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Service Worker support
    swcMinify: true,
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig`},{path:"public/manifest.json",content:`{
  "name": "{{PROJECT_NAME}}",
  "short_name": "{{PROJECT_NAME}}",
  "description": "A Fluid PWA application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`,template:!0},{path:"README.md",content:`# {{PROJECT_NAME}}

This is a [Fluid PWA](https://fluid-pwa.dev) project bootstrapped with \`create-fluid-pwa\`.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

This project includes:
- \u{1F4F1} Offline-first PWA functionality
- \u{1F5C4}\uFE0F Local data management with Dexie.js
- \u{1F504} Automatic sync status tracking
- \u{1F3A8} Tailwind CSS for styling
- \u2705 TypeScript support

## Learn More

To learn more about Fluid PWA, take a look at the following resources:

- [Fluid PWA Documentation](https://fluid-pwa.dev/docs) - learn about Fluid PWA features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy

The easiest way to deploy your Fluid PWA app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Fluid PWA deployment documentation](https://fluid-pwa.dev/docs/deployment) for more details.`,template:!0}]};var x={...o,name:"full-featured",description:"Complete setup with all batteries included",features:["auth","sync","push-notifications","analytics"],dependencies:{...o.dependencies,"next-auth":"^4.24.0","workbox-webpack-plugin":"^7.0.0"},devDependencies:{...o.devDependencies,"@types/react":"^18.0.0","@types/react-dom":"^18.0.0"}};var N={...o,name:"e-commerce",description:"Optimized for online stores and marketplaces",features:["auth","file-storage","analytics","encryption"],dependencies:{...o.dependencies,stripe:"^14.0.0","@stripe/stripe-js":"^2.0.0"}};var C={...o,name:"dashboard",description:"Perfect for admin panels and analytics dashboards",features:["auth","real-time","analytics","ui-library"],dependencies:{...o.dependencies,recharts:"^2.8.0","date-fns":"^2.30.0"}};var P={...o,name:"blog",description:"Content management and publishing platform",features:["file-storage","analytics"],dependencies:{...o.dependencies,"gray-matter":"^4.0.3",remark:"^15.0.1","remark-html":"^16.0.1"}};var T={...o,name:"social",description:"Social features and user interactions",features:["auth","real-time","push-notifications","file-storage"],dependencies:{...o.dependencies,"socket.io-client":"^4.7.0","react-hook-form":"^7.48.0"}};var G={basic:o,"full-featured":x,"e-commerce":N,dashboard:C,blog:P,social:T};async function A(t){let e=G[t];if(!e)throw new Error(`Unknown template: ${t}`);return e}async function S(t,e,n){console.log(`Applying features: ${e.join(", ")}`)}async function j(t){let e=m.default.join(process.cwd(),t.projectName);if(await c.default.pathExists(e))throw new Error(`Directory ${t.projectName} already exists`);await c.default.ensureDir(e);let n=await A(t.template);await U(e,n,t),await S(e,t.features,t),await L(e,t,n),t.initGit&&await V(e),t.installDeps&&await Y(e,t.packageManager)}async function U(t,e,n){for(let r of e.files){let l=m.default.join(t,r.path),u=m.default.dirname(l);if(await c.default.ensureDir(u),r.template){let f=_(r.content,n);await c.default.writeFile(l,f,"utf-8")}else await c.default.writeFile(l,r.content,"utf-8")}}function _(t,e){return t.replace(/{{PROJECT_NAME}}/g,e.projectName).replace(/{{USE_TYPESCRIPT}}/g,e.useTypeScript.toString()).replace(/{{STYLING}}/g,e.styling).replace(/{{FEATURES}}/g,JSON.stringify(e.features))}async function L(t,e,n){let r={name:e.projectName,version:"0.1.0",private:!0,description:`A Fluid PWA project created with ${e.template} template`,scripts:{dev:"next dev",build:"next build",start:"next start",lint:"next lint",...n.scripts},dependencies:{"fluid-pwa":"^1.0.0",next:"^15.0.0",react:"^18.0.0","react-dom":"^18.0.0",...n.dependencies},devDependencies:{"@types/node":"^20.0.0",typescript:"^5.0.0",eslint:"^8.0.0","eslint-config-next":"^15.0.0",...n.devDependencies}};e.useTypeScript||(delete r.devDependencies.typescript,delete r.devDependencies["@types/node"]),await c.default.writeFile(m.default.join(t,"package.json"),JSON.stringify(r,null,2),"utf-8")}async function V(t){try{await(0,d.execa)("git",["init"],{cwd:t}),await(0,d.execa)("git",["add","."],{cwd:t}),await(0,d.execa)("git",["commit","-m","Initial commit"],{cwd:t})}catch(e){console.warn("Failed to initialize git repository:",e)}}async function Y(t,e){let r={npm:["install"],yarn:["install"],pnpm:["install"],bun:["install"]}[e];if(!r)throw new Error(`Unknown package manager: ${e}`);await(0,d.execa)(e,r,{cwd:t})}var k=p(require("validate-npm-package-name"));function F(t){let e=(0,k.default)(t);return e.validForNewPackages?{valid:!0}:{valid:!1,problems:[...e.errors||[],...e.warnings||[]]}}var $=(0,E.default)(["#0ea5e9","#3b82f6","#6366f1"]);async function B(){console.clear(),(0,i.intro)($("\u{1F680} Welcome to Fluid PWA"));let t=await(0,i.text)({message:"What is your project name?",placeholder:"my-fluid-pwa",validate(g){if(!g)return"Please enter a project name";let w=F(g);if(!w.valid)return w.problems[0]}});typeof t=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let e=await(0,i.select)({message:"Choose a template:",options:[{value:"basic",label:"\u{1F4E6} Basic",hint:"Minimal setup with essential features"},{value:"full-featured",label:"\u{1F3AF} Full Featured",hint:"Complete setup with all batteries included"},{value:"e-commerce",label:"\u{1F6D2} E-commerce",hint:"Optimized for online stores and marketplaces"},{value:"dashboard",label:"\u{1F4CA} Dashboard",hint:"Perfect for admin panels and analytics"},{value:"blog",label:"\u{1F4DD} Blog/CMS",hint:"Content management and publishing"},{value:"social",label:"\u{1F465} Social Media",hint:"Social features and user interactions"}]});typeof e=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let n=await(0,i.multiselect)({message:"Select features to include (batteries):",options:[{value:"auth",label:"\u{1F510} Authentication",hint:"User login/logout with offline support"},{value:"sync",label:"\u{1F504} Background Sync",hint:"Automatic data synchronization"},{value:"push-notifications",label:"\u{1F4E2} Push Notifications",hint:"Web push notifications support"},{value:"file-storage",label:"\u{1F4C1} File Storage",hint:"Offline file management and caching"},{value:"real-time",label:"\u26A1 Real-time Updates",hint:"WebSocket/SSE integration"},{value:"analytics",label:"\u{1F4C8} Analytics",hint:"Offline-first analytics tracking"},{value:"encryption",label:"\u{1F512} Data Encryption",hint:"Client-side data encryption"},{value:"wasm",label:"\u2699\uFE0F WebAssembly",hint:"WASM modules for performance"},{value:"workers",label:"\u{1F477} Web Workers",hint:"Background processing threads"},{value:"ui-library",label:"\u{1F3A8} UI Component Library",hint:"Pre-built PWA-optimized components"}],required:!1});typeof n=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let r=await(0,i.select)({message:"Choose your styling approach:",options:[{value:"tailwind",label:"\u{1F3A8} Tailwind CSS",hint:"Utility-first CSS framework"},{value:"styled-components",label:"\u{1F485} Styled Components",hint:"CSS-in-JS styling"},{value:"emotion",label:"\u{1F60A} Emotion",hint:"CSS-in-JS with excellent performance"},{value:"vanilla-css",label:"\u{1F4C4} Vanilla CSS",hint:"Plain CSS with CSS modules"}]});typeof r=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let l=await(0,i.select)({message:"Choose package manager:",options:[{value:"npm",label:"\u{1F4E6} npm",hint:"Node Package Manager"},{value:"yarn",label:"\u{1F9F6} Yarn",hint:"Fast, reliable package manager"},{value:"pnpm",label:"\u{1F4C0} pnpm",hint:"Fast, disk space efficient"},{value:"bun",label:"\u{1F35E} Bun",hint:"Ultra-fast JavaScript runtime"}]});typeof l=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let u=await(0,i.confirm)({message:"Use TypeScript?",initialValue:!0});typeof u=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let f=await(0,i.confirm)({message:"Initialize Git repository?",initialValue:!0});typeof f=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let h=await(0,i.confirm)({message:"Install dependencies?",initialValue:!0});typeof h=="symbol"&&((0,i.cancel)("Operation cancelled."),process.exit(0));let s={projectName:t,template:e,features:n,styling:r,packageManager:l,useTypeScript:u,initGit:f,installDeps:h};(0,i.note)(`
${a.default.bold("Project Configuration:")}
${a.default.gray("\u251C\u2500")} Name: ${a.default.cyan(s.projectName)}
${a.default.gray("\u251C\u2500")} Template: ${a.default.cyan(s.template)}
${a.default.gray("\u251C\u2500")} Features: ${a.default.cyan(s.features.length>0?s.features.join(", "):"None")}
${a.default.gray("\u251C\u2500")} Styling: ${a.default.cyan(s.styling)}
${a.default.gray("\u251C\u2500")} Package Manager: ${a.default.cyan(s.packageManager)}
${a.default.gray("\u251C\u2500")} TypeScript: ${a.default.cyan(s.useTypeScript?"Yes":"No")}
${a.default.gray("\u251C\u2500")} Git: ${a.default.cyan(s.initGit?"Yes":"No")}
${a.default.gray("\u2514\u2500")} Install deps: ${a.default.cyan(s.installDeps?"Yes":"No")}
    `.trim(),"Configuration Summary");let b=await(0,i.confirm)({message:"Proceed with project creation?",initialValue:!0});(!b||typeof b=="symbol")&&((0,i.cancel)("Operation cancelled."),process.exit(0));let y=(0,i.spinner)();y.start("Creating your Fluid PWA project...");try{await j(s),y.stop("Project created successfully!"),(0,i.outro)(`${$("\u{1F389} Success!")} Your Fluid PWA project has been created.

${a.default.bold("Next steps:")}
${a.default.gray("1.")} ${a.default.cyan(`cd ${s.projectName}`)}
${a.default.gray("2.")} ${s.installDeps?a.default.gray("Dependencies installed \u2713"):a.default.cyan(`${s.packageManager} install`)}
${a.default.gray("3.")} ${a.default.cyan(`${s.packageManager} run dev`)}

${a.default.bold("Documentation:")}
${a.default.gray("\u251C\u2500")} ${a.default.blue("https://fluid-pwa.dev/docs")}
${a.default.gray("\u251C\u2500")} ${a.default.blue("https://fluid-pwa.dev/examples")}
${a.default.gray("\u2514\u2500")} ${a.default.blue("https://github.com/fluid-pwa/fluid-pwa")}

${a.default.dim("Happy coding with Fluid PWA! \u{1F680}")}`)}catch(g){y.stop("Failed to create project"),console.error(a.default.red("Error:"),g),process.exit(1)}}var O=new W.Command;O.name("create-fluid-pwa").description("\u{1F680} Create a new Fluid PWA project").version("1.0.0").argument("[project-name]","Name of the project").option("-t, --template <template>","Project template").option("--no-install","Skip dependency installation").option("--no-git","Skip Git initialization").option("--typescript","Use TypeScript").option("--javascript","Use JavaScript").action(async(t,e)=>{(t||Object.keys(e).length>0)&&console.log(a.default.yellow("Non-interactive mode not yet implemented. Using interactive mode...")),await B()});O.parse();
