import axios from 'axios';
import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get weather by city
router.get('/city/:city', async (req, res) => {
  const { city } = req.params;

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no&lang=fr`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching weather data:', err.message);
    res.status(500).send('Server error');
  }
});

// Get weather by location (latitude and longitude)
router.get('/location', async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=no&lang=fr`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching weather data:', err.message);
    res.status(500).send('Server error');
  }
});

// Get weather forecast by city
router.get('/forecast/:city', async (req, res) => {
  const { city } = req.params;

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${city}&days=10&aqi=no&lang=fr`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching weather forecast:', err.message);
    res.status(500).send('Server error');
  }
});

// Get weather forecast by location (latitude and longitude)
router.get('/forecast/location', async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}&days=10&aqi=no&lang=fr`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching weather forecast:', err.message);
    res.status(500).send('Server error');
  }
});

// Get all favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a favorite
router.post('/favorites', auth, async (req, res) => {
  const { city } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(city)) {
      return res
        .status(200)
        .json({ msg: 'City already in favorites', alreadyAdded: true });
    }

    user.favorites.push(city);
    await user.save();
    res.json({
      msg: 'City added to favorites',
      alreadyAdded: false,
      favorites: user.favorites,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove a favorite
router.delete('/favorites/:city', auth, async (req, res) => {
  const { city } = req.params;

  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter((fav) => fav !== city);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get weather data for all favorite cities
router.get('/favorites/weather', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cities = user.favorites;

    const weatherPromises = cities.map((city) =>
      axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no&lang=fr`
      )
    );

    const weatherResponses = await Promise.all(weatherPromises);

    const weatherData = weatherResponses.map((response, index) => ({
      city: cities[index],
      weather: response.data,
    }));

    res.json(weatherData);
  } catch (err) {
    console.error('Error fetching weather data for favorites:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
