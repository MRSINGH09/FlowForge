# FlowForge

A production-grade visual workflow automation platform inspired by n8n and Zapier.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- TailwindCSS + Shadcn UI
- Zustand
- ReactFlow
- React Hook Form + Zod
- Axios

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Authentication (login/signup with session persistence)
- Workflow dashboard (create, search, rename, duplicate, delete)
- Visual workflow editor with ReactFlow canvas
- Drag-and-drop node system with registry
- Node configuration panel
- Workflow persistence (localStorage, backend-ready API layer)

## Project Structure

```
src/
├── app/              # Next.js routes
├── components/       # Shared UI components
├── features/         # Feature modules
│   ├── auth/
│   ├── workflow/
│   ├── canvas/
│   ├── nodes/
│   └── configuration/
├── store/            # Zustand stores
├── services/         # API client
├── types/            # Shared types
└── lib/              # Utilities
```
