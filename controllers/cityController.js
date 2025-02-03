const City = require("../models/City");

// Add City
exports.addCity = async (req, res) => {
  try {
    const { name, population, country, latitude, longitude } = req.body;
    const cityExists = await City.findOne({ name });

    if (cityExists) {
      return res.status(400).json({ message: "City already exists" });
    }

    const city = new City({ name, population, country, latitude, longitude });
    await city.save();
    res.status(201).json({ message: "City added successfully", city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update City
exports.updateCity = async (req, res) => {
  try {
    const { name } = req.params;
    const updatedCity = await City.findOneAndUpdate({ name }, req.body, { new: true });

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City updated successfully", updatedCity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete City
exports.deleteCity = async (req, res) => {
  try {
    const { name } = req.params;
    const deletedCity = await City.findOneAndDelete({ name });

    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cities with Filters, Pagination, Sorting, and Searching
exports.getCities = async (req, res) => {
  try {
    let { page = 1, limit = 10, filter = {}, sort = {}, search = "", projection = {} } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = search ? { name: { $regex: search, $options: "i" } } : filter;
    const cities = await City.find(query, projection)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCities = await City.countDocuments(query);
    res.json({ total: totalCities, page, limit, cities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
