**City Management API**
This is a RESTful API for managing cities, allowing CRUD operations with advanced querying features like pagination, filtering, sorting, and searching.

**Features**
Add City: Allows adding new cities with details such as name, population, country, latitude, and longitude.
Get Cities: Retrieves a list of cities with support for pagination, filtering, sorting, and searching.
Update City: Updates an existing city's details based on a unique identifier.
Delete City: Deletes a city using its name or identifier.
Delete All Cities: Deletes all cities at once.

**Technologies Used**
Node.js: Backend runtime environment.
Express.js: Web framework for building RESTful APIs.
MongoDB: NoSQL database for storing city-data.
Mongoose: ODM for MongoDB to interact with the database.

**Setup**
Clone the repository.
Install dependencies with npm install.
Set up a MongoDB connection string in .env.
Run the server with npm start.

**Endpoints**
POST /api/addCity: Add a new city.

GET /api/cities: Get all cities with options for pagination and filtering.

GET /api/cities/:id: Get a city by its ID.

PUT /api/cities/updateCity/:id: Update a city.

DELETE /api/cities/deleteCity/:id: Delete a city by ID.
