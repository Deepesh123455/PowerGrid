import axios from 'axios';
import type { OpenWeatherResponse, WeatherData } from '../types/weather.types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const weatherApi = {
  async getCurrentWeather(city: string = 'Delhi'): Promise<WeatherData> {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is missing from environment variables.');
    }

    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get<OpenWeatherResponse>(url);
      const data = response.data;

      // Extract only the necessary fields as requested
      // Convert wind speed from m/s to km/h (metric standard in OWM is m/s)
      const windSpeedKmh = Math.round(data.wind.speed * 3.6);

      return {
        temperature: Math.round(data.main.temp * 10) / 10, // keep 1 decimal place like 30.4
        condition: data.weather[0]?.main || 'Unknown',
        humidity: Math.round(data.main.humidity),
        windSpeed: windSpeedKmh,
        iconId: data.weather[0]?.icon || '01d',
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
};
