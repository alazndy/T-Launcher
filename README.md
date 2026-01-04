# T-Launcher: T-Ecosystem Developer Dashboard

![Status](https://img.shields.io/badge/Status-Beta-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20Socket.IO-61DAFB)

**T-Launcher** is the central command center for the T-Ecosystem. It provides a unified dashboard to manage, monitor, and configure all local development applications in the ecosystem.

## 🚀 Features

- **Unified Process Management**: Start, stop, and restart all T-Ecosystem apps (ENV-I, UPH, Weave, etc.) from a single interface.
- **Real-Time Terminal Streaming**: View live logs for each application via integrated xterm.js terminals.
- **Environment Editor**: Visual editor for .env files, making configuration management a breeze.
- **Git Integration**: Monitor git status and pull latest changes for each repository with one click.
- **Port Management**: Automatically detects and handles port conflicts.

## 📦 Supported Applications

| App ID | Name | Port | Description |
|--------|------|------|-------------|
| **envi** | ENV-I | \3000\ | Inventory & Stock Management System |
| **uph** | UPH | \3001\ | Unified Project Hub & Task Management |
| **market** | t-Market | \3002\ | Ecosystem Marketplace |
| **weave** | Weave | \3004\ | Schematic Design Tool |
| **tsa** | T-SA | \5173\ | Technical Specification Analysis |
| **renderci**| RenderCi | \5174\ | Batch Rendering Service |

## 🛠️ Architecture

T-Launcher uses a split **Client-Server** architecture:

- **Server (/server)**: Node.js + Express + Socket.IO. Handles process spawning (
ode-pty), file I/O, and system operations.
- **Client (/client)**: React + Vite + Tailwind CSS. Provides the modern dashboard UI and communicates via WebSocket.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm

### Installation

\\\ash
# 1. Clone the repository
git clone https://github.com/alazndy/T-Launcher.git
cd T-Launcher

# 2. Install Server Dependencies
cd server
pnpm install

# 3. Install Client Dependencies
cd ../client
pnpm install
\\\

### Running the Dashboard

You need to run both client and server.

**Option 1: Parallel (Recommended)**
Use a terminal multiplexer or just open two terminals.

Terminal 1 (Server):
\\\ash
cd server
node index.js
\\\

Terminal 2 (Client):
\\\ash
cd client
pnpm dev
\\\

Open [http://localhost:5173](http://localhost:5173) to view the dashboard.

## 🔒 Security Note

This tool has full access to your local file system and shell. **Do not expose the server port to the public internet.** It is intended for local development use only.

---

Designed for the **T-Ecosystem**.

