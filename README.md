# Streakly - Learning Progress Tracker

Streakly is a gamified learning progress tracker designed to help users organize their learning paths into "Journeys", track tasks, manage resources, and maintain learning streaks.

## Features

- **Journeys**: Organize learning goals into dedicated journeys.
- **Task Management**: Break down journeys into actionable tasks.
- **Resource Hub**: Store and manage reference materials (links, files) for each journey.
- **Gamification**: Track daily streaks to stay motivated.
- **Progress Tracking**: Visual indicators of journey completion.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS via PostCSS
- React Router DOM
- Framer Motion (Animations)
- React Icons

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (File Uploads)

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Streakly
   ```

2. **Backend Setup:**
   Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   CLIENT_URL=http://localhost:5173
   ```
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Navigate to the client directory:
   ```bash
   cd ../client
   npm install
   ```
   
   Create a `.env` file in the `client` directory (or use `.env.example` as a template):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
   
   Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Register for a new account or login with Google.
2. Create a new "Journey" for a topic you are learning.
3. Add tasks and resources to your journey.
4. Mark tasks as complete to increase your progress and maintain your streak!
