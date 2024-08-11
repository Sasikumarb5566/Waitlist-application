# Waitlist Application Readme

This readme provides instructions for installiing and running the Waitlist Application. The application consists of both frontend and backend components and uses MongoDB as its database. You have a way to run the application by manually.

## Installation and Setup

### Manual Setup

Follow these steps to manually set up the Waitlist Application:

1. Clone the repository:

    ```
    git clone https://github.com/Sasikumarb5566/Waitlist-application
    ```

2. Change into the frontend directory:

    ```
    cd front-end
    ```
3. Install frontend dependencies:

    ```
    npm install
    ```

4. Change into the backend directory:

    ```
    cd back-end
    ```

5. Install backend dependencies:

    ```
    npm install
    ```

6. Make sure MongoDB is installed on your loca machine. If you have error when connect to mongoDB change the url in .env file.

7. Start the frontend:

    ```
    npm run dev
    ```

8. Start the backend:

    ```
    nodemon server.js
    ```
