const express = require("express");
const router = express.Router();
const City = require("../models/City"); // Import the City model

// POST request to add a new city
router.post("/addCity", async (req, res) => {
  try {
    const { name, population, country, latitude, longitude } = req.body;

    // Ensure all required fields are provided
    if (!name || !population || !country || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the city already exists
    const existingCity = await City.findOne({ name });
    if (existingCity) {
      return res.status(400).json({ message: "City with this name already exists" });
    }

    // Create a new city
    const newCity = new City({
      name,
      population,
      country,
      latitude,
      longitude
    });

    // Save the city to the database
    await newCity.save();
    res.status(201).json({ message: "City added successfully", city: newCity });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT request to update an existing city
router.put("/updateCity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, population, country, latitude, longitude } = req.body;

    // Create an object to hold the updated fields
    const updatedCityData = {};

    // Only add the fields that are provided in the request body
    if (name) updatedCityData.name = name;
    if (population) updatedCityData.population = population;
    if (country) updatedCityData.country = country;
    if (latitude) updatedCityData.latitude = latitude;
    if (longitude) updatedCityData.longitude = longitude;

    // If no fields are provided to update, return an error
    if (Object.keys(updatedCityData).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    // Find and update the city
    const updatedCity = await City.findByIdAndUpdate(id, updatedCityData, { new: true });

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ message: "City updated successfully", city: updatedCity });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// DELETE request to delete a city by ID or name
router.delete("/deleteCity/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the city by ID
    const deletedCity = await City.findByIdAndDelete(id);
    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: Get cities with filtering, searching, pagination, and sorting
router.get("/cities", async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, filter, sort, search, fields } = req.query;

    // Convert to number
    const skip = (page - 1) * limit;
    const limitNumber = parseInt(limit);

    // Build filter object from query params
    let filterObj = {};
    if (filter) {
      const filters = JSON.parse(filter); // Assuming it's passed as JSON string
      if (filters.population) filterObj.population = filters.population;
      if (filters.country) filterObj.country = filters.country;
    }

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = { name: { $regex: search, $options: "i" } }; // Case-insensitive search
    }

    // Combine filter and search query
    const query = { ...filterObj, ...searchQuery };

    // Build projection (fields to include/exclude)
    let projection = {};
    if (fields) {
      const fieldList = fields.split(","); // Fields are passed as comma-separated string
      fieldList.forEach(field => {
        projection[field] = 1; // Include these fields in the result
      });
    }

    // Query MongoDB with filters, search, pagination, and projection
    const cities = await City.find(query)
      .skip(skip)
      .limit(limitNumber)
      .select(projection)
      .sort(sort ? { [sort]: 1 } : {}); // Sort in ascending order if sort is passed

    const totalCities = await City.countDocuments(query); // Get total count for pagination

    // Send response
    res.status(200).json({
      page: parseInt(page),
      limit: limitNumber,
      total: totalCities,
      cities: cities
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error });
  }
});

// DELETE: Delete all cities
router.delete("/deleteAllCities", async (req, res) => {
  try {
    await City.deleteMany(); // Delete all cities
    res.status(200).json({ message: "All cities deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
