# GarfAI Backend

A TypeScript Express backend application for GarfAI.

## Tech Stack

- TypeScript
- Node.js
- Express
- Nodemon (for development)
- Lodash
- Yup

## Getting Started

### Prerequisites

Make sure you have Node.js installed. This project uses the LTS version specified in `.nvmrc`.

```bash
# If you have nvm installed, run:
nvm use
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The server will be running at http://localhost:3000

### Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Run the built application
- `npm test`: Run tests

## API Endpoints

- `GET /`: Hello world endpoint

## Project Structure

```
garfai-be/
├── src/             # Source code
│   └── index.ts     # Main application entry point
├── dist/            # Compiled JavaScript (generated)
├── package.json     # Project dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── README.md        # Project documentation
```
