HOTEL BOOKING WEBSITE

A full-stack hotel booking web application built using React.js, Express.js, Node.js and MongoDB. Users can explore available rooms, make bookings, and manage their reservations.

Features

-> View available hotel rooms and room deatils
-> Book rooms by selecting check-in and check-out dates
-> Calculate booking prices based on the number of nights
-> View and manage customer bookings 
-> Update booking statuses
-> Delete bookings 
-> Responsive and user-friendly interface

Technologies Used

Frontend:-
React.js
JavaScript
HTML
CSS
Backend:-
Node.js
Express.js
Database:-
MongoDB
Mongoose
Development Tools:-
Visual Studio code
GitHub
npm
Postman

Project Structure

Hotel-Booking-Website/
|--client/
|      |__src/
|--server/
|   |    |__models/
|   |        |--Booking.js
|   |         |--Room.js
|   |_________app.js
|   |_________Package.json
|   |_________.env
|__ .gitignore

Installation and Setup

1. Clone the repository
   git clone
   https://github.com/krishna-web-dev20/Hotel-Booking-Website.git

2. Open the project folder
   cd Hotel-Booking-Website

3. Set up the backend
    cd server
    npm install
Configure your MongoDB connection string in the server's .env file:

MONGO_URI=your_mongodb_connection_string

Start the backend using the command configured in your server's package.json.

4. Set up the frontend
   Open a second terminal :
   cd client
   npm install
   npm run dev
Open the local URL displayed in your terminal to view the website.

Environment Variables

Keep database credentials and other secrets in your local .env file. Do not upload private credentials to GitHub.

Future Improvements 
-> Payment simulation for demonstration purposes
-> User authentication and authorization 
-> Room availability checking
-> Booking confirmation notification
-> Deployment to a hosting platform 

Author
Krishna Karthik Desai
-> GitHub: krishna-web-dev20
License
This project was created for learning and portfolio demonstration purpose.
