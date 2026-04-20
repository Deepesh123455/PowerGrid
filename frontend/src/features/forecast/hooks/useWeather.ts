import { useState, useEffect } from 'react';
import { weatherApi } from '../api/weather.api';
import type { WeatherData } from '../types/weather.types';

export function useWeather(city: string = 'Delhi') {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather() {
      setIsLoading(true);
      setError(null);
      
      try {
        const weather = await weatherApi.getCurrentWeather(city);
        if (isMounted) {
          setData(weather);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching weather'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchWeather();

    // Auto-refresh weather every 15 minutes
    const intervalId = setInterval(fetchWeather, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [city]);

  return { data, isLoading, error };
}
