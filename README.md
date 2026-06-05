# Enkai

A small event booking app built with Vite + React (client) and Node.js (server).

## Features
- User authentication
- Event listing and booking
- Payment flow with success/failure pages

## Prerequisites
- Node.js 16+ and npm

## Install
1. Install root dependencies:

```bash
npm install
```

2. Install client and server dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

## Running Locally
- Start the server:

```bash
cd server
npm run dev
```

- Start the client:

```bash
cd client
npm run dev
```

Open your browser to the address shown by the Vite dev server (usually http://localhost:5173).

## Repository Structure
- `client/` — React frontend (Vite)
- `server/` — Node/Express backend

## Next Steps
- Consider adding a top-level `start` script to run both client and server concurrently.

## License
MIT