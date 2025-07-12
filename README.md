# GarfAI Backend

A TypeScript Express backend application for GarfAI.

## Tech Stack

- TypeScript
- Node.js
- Express
- Passport.js (for authentication)
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

2. Set up environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your Google OAuth credentials
```

3. Start the development server:

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

### Public Endpoints

- `GET /`: Hello world endpoint

### Authentication Endpoints

- `GET /auth/google`: Initiates Google OAuth authentication
- `GET /auth/google/callback`: Google OAuth callback URL
- `GET /auth/login/success`: Returns user information after successful authentication
- `GET /auth/login/failed`: Returns error information after failed authentication
- `GET /auth/logout`: Logs out the authenticated user

### Protected Endpoints

- `GET /protected`: Example protected route (requires authentication)

## Authentication

This application uses Google OAuth 2.0 for authentication via Passport.js. For detailed setup instructions, see [src/auth/README.md](src/auth/README.md).

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
