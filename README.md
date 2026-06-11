# FrankPower LTD

A web-based platform that enables students to apply for both SIWES Internship programs and Academic courses (such as Cybersecurity, Web Development, Data Analytics, and UI/UX). Students are also issued a certificate upon completion of any of the programs.

## API Documentation

For detailed API documentation, please visit: [API Documentation](https://documenter.getpostman.com/view/17470911/2sB3WsQKi9)

## Getting Started with Vite + React

This section will guide you through setting up the project locally.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm, yarn, or pnpm


### Setup

1.  **Clone the repository**

    ```sh
    git clone https://github.com/Frankpower-Ltd/frontend.git
    ```

2.  **Install dependencies**

    Using npm:

    ```sh
    npm install
    ```

    Or using yarn:

    ```sh
    yarn
    ```

3.  **Set up environment variables**

    This project includes a `.env.example` file. To get started, you need to create your own `.env` file and populate it with the necessary values.

    ```sh
    cp .env.example .env
    ```

    Now, open the `.env` file and add the required environment variables.

4.  **Run the development server**

    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173` by default.

## Available Scripts

This project comes with a set of useful scripts to help with development:

- `"dev": "vite"`
  - Starts the development server with Hot Module Replacement (HMR).

- `"build": "tsc -b && vite build"`
  - Compiles the TypeScript code and bundles the application for production.

- `"lint": "eslint ."`
  - Runs the linter to check for code quality and style issues.

- `"lint:fix": "eslint . --fix"`
  - Automatically fixes fixable ESLint issues.

- `"format": "prettier --write"`
  - Formats all files in the project using Prettier.

- `"preview": "vite preview"`
  - Serves the production build locally to preview before deployment.

- `"prepare": "husky"`
  - Sets up Husky for Git hooks.

- `"test": "tsc --noEmit"`
  - Performs a TypeScript check without emitting files to ensure type safety.

### Branching

**Always create a new branch** when working on a new feature, bug fix, or any other change. Do not commit directly to the `main` branch.

Branch naming convention:

- For features: `feat/your-feature-name`
- For bug fixes: `fix/your-bug-fix-name`

Example:

```sh
git checkout -b feat/add-user-authentication
```

### Pre-commit Hooks

To ensure code quality and consistency, this project uses automated pre-commit hooks. Before your code is committed, the following checks are performed automatically:

1.  **Linting and Formatting**: `lint-staged` runs ESLint and Prettier on staged files to fix formatting and style issues.
2.  **Type Checking**: `npm test` (`tsc --noEmit`) runs to check the entire project for any TypeScript errors.

If any of these checks fail, the commit will be aborted. This process helps maintain a clean and error-free codebase, so you must ensure your code is free of type errors for the commit to succeed.

### Pull Requests

Once your work is complete, has passed the tests, and you have pushed your branch, you can open a pull request to merge your changes into the **`dev`** branch. The `main` branch is reserved for production-ready code.

