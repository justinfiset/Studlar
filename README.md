# 📘 Studlar

Studlar is a web application designed to help manage boards and tasks efficiently. It features a Python FastAPI backend and a React (Next.js) frontend.

---

## 🚀 Getting Started

### 🧠 Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- Git

---

## 📦 API (Backend)

1. Open a terminal and navigate to the `api` directory:

    ```bash
    cd api
    ```

2. Create a virtual environment:

    ```bash
    python -m venv env
    ```

3. Activate the environment:

    **On Windows:**
    ```bash
    .\env\Scripts\activate
    ```

    **On macOS / Linux:**
    ```bash
    source env/bin/activate
    ```

4. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Run the API server:

    ```bash
    python -m main
    ```

> The API should now be running at `http://localhost:8000`.

---

## 🌐 Frontend (Next.js)

1. Navigate to the frontend folder:

    ```bash
    cd studlar
    ```

2. Create a `.env.local` file at the root of the project and add this line (replace the URL if needed):

    ```env
    API_BASE_URL=http://localhost:8000
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

> The frontend will be running at `http://localhost:3000`.

---

## 🧪 Tech Stack

- Backend: [FastAPI](https://fastapi.tiangolo.com/)
- Frontend: [Next.js](https://nextjs.org/)
- Database: [SQLite](https://www.sqlite.org/index.html) (used for development)

---

## 💡 Authors

- 👥 Justin Fiset

