# Almostashar Web Project 🚀

Welcome to the **Almostashar Web** project, a comprehensive platform built with modern web technologies (React + Vite). This project is designed to be scalable and maintainable by following a **Feature-Based Architecture**.

---

## 🛠️ Getting Started

Follow these steps to get the project running on your local machine:

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: (LTS version recommended)
- **npm** or **yarn**

### 2. Cloning the Project
Open your terminal and run:
```bash
git clone https://github.com/Mohamed-ALQarram/almostashar-web.git
cd almostashar-web
```

### 3. Installing Dependencies
To install all required node modules:
```bash
npm install
```

### 4. Running the Project
To start the development server:
```bash
npm run dev
```
Once started, the project will be available at the URL shown in your terminal (usually `http://localhost:5173`).

---

## 🏗️ Feature-Based Architecture

This project organizes code based on **Features** rather than just technical roles. This approach ensures that Each feature is a self-contained unit, making it easier to scale, test, and maintain.

### `src/` Directory Structure:

```text
src/
├── assets/          # Images, fonts, and static files.
├── components/      # Shared Components used across multiple features.
├── features/        # (Core) Contains all application features, logically separated.
│   └── auth/        # Example: Authentication feature
│       ├── api/     # API requests specific to this feature.
│       ├── components/ # Components used only within this feature.
│       ├── hooks/   # Custom hooks specific to this feature.
│       └── index.js # Public API - Export only what's needed by the rest of the app.
├── hooks/           # Global and shared Custom Hooks.
├── pages/           # Components that assemble features into full pages (e.g., Home, Login).
├── routes/          # Routing configuration.
├── services/        # Common services (e.g., Axios instances).
├── store/           # Global State Management.
└── utils/           # Shared Helper Functions.
```

### 💡 Rules for Feature-Based Development:
1. **Encapsulation**: Keep features as independent as possible.
2. **Public API**: Use the `index.js` file within each feature folder to export components or hooks. **Always** import from the feature's `index.js` rather than reaching into its internal subdirectories.
3. **Shared vs. Feature-Specific**: If a component is used in only one feature, keep it in `features/[feature-name]/components`. If it needs to be reused across different features, move it to the global `src/components`.

---

## 🚀 Technologies Used
- **React**: Frontend library.
- **Vite**: Ultra-fast build tool.
- **React Router**: For client-side routing.
- **Tailwind CSS v3**: Utility-first CSS framework for styling.
- **React Hook Form**: For performant and flexible form management.
- **Yup**: Schema validation for forms.
- **Zustand**: Small, fast, and scalable bearbones state-management.
- **TanStack Query**: Powerful asynchronous state management (Fetching, caching, etc.).
- **Axios**: Promise-based HTTP client for the browser and node.js.

---

Happy coding! If you have any questions or encounter issues, please contact the development team. ✨
