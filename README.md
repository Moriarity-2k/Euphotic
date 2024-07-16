# Dish Dashboard - Euphotic Task

## Overview

The Dish Dashboard is a web application that displays a list of dishes and allows users to toggle their publication status. The application features real-time updates via WebSockets and is built using React, Express, MongoDB, and WebSocket.

## Features

- Display a list of dishes with their details
- Toggle the publication status of each dish
- Real-time updates using WebSockets
- Error handling and loading states for better user experience

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express, MongoDB, WebSocket, Mongoose
- Environment Variables: dotenv

## Setup Instructions

### Prerequisites

- Node.js and npm (or yarn) installed
- MongoDB installed and running

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/dish-dashboard.git
   ```
2. **Install dependencies for both client and server:**
   ``sh
    cd client
    npm install
    cd ../server
    npm install
   ``
3. **Set up environment variables:**
   In server create a .env file
   ```sh
    PORT=
    DATABASE=your mongodb url
    BASE_URL=http://localhost:5173
    ```
4. **Start the development server:**
    Open two terminal windows/tabs.

    In the first terminal, start the server:
    ```sh
    cd server && npm run start
    ```

    In the second terminal
    ```sh
    cd client && npm run dev
    ```

### Usage
  - View Dishes: The main dashboard displays a list of dishes with their names, images, and publication status.
  - Toggle Publication Status: Click the "Toggle Published" button on a dish card to change its publication status.


  
   
