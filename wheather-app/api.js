// Keep API requests separate from the user-interface code.
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(city) {
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Add your OpenWeatherMap API key in Weather-App/api.js before searching.");
  }

  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units: "metric"
  });

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message === "city not found"
      ? "City not found. Check the spelling and try again."
      : (data.message || "Unable to get weather information."));
  }

  return data;
}
