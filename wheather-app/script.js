import { getWeather } from "./api.js";

const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const statusText = document.querySelector("#status");
const weatherCard = document.querySelector("#weather-card");

const show = (selector, value) => {
  document.querySelector(selector).textContent = value;
};

function renderWeather(data) {
  // Destructuring extracts the fields needed from the API response.
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    weather,
    wind: { speed },
    clouds: { all }
  } = data;

  const current = weather[0];
  show("#place", `${name}, ${country}`);
  show("#date", new Date().toLocaleString(undefined, {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
  }));
  show("#temperature", `${Math.round(temp)}°`);
  show("#condition", current.description);
  show("#feels-like", `Feels like ${Math.round(feels_like)}°C`);
  show("#humidity", `${humidity}%`);
  show("#wind", `${speed} m/s`);
  show("#pressure", `${pressure} hPa`);
  show("#clouds", `${all}%`);

  const icon = document.querySelector("#weather-icon");
  icon.src = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;
  icon.alt = current.description;
  weatherCard.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    statusText.textContent = "Please enter a city name.";
    return;
  }

  statusText.textContent = "Loading weather...";
  weatherCard.classList.add("hidden");

  try {
    const data = await getWeather(city);
    renderWeather(data);
    statusText.textContent = `Weather successfully loaded for ${data.name}.`;
  } catch (error) {
    statusText.textContent = error.message || "Something went wrong. Please try again.";
  }
});
