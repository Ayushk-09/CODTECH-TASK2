const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const weatherResults = document.getElementById('weather-results');

const apiKey = '4b4ef49aa5c535db462156c7e77a2692'; // Replace with your actual API key

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userInput = searchInput.value.trim();
  
  if (userInput) {
    // Determine if the input is a city name or pincode
    if (!isNaN(userInput) && userInput.length === 6) {
      // Assume pincode format (numeric with 6 digits)
      const weatherData = await getWeatherByPincode(userInput);
      displayWeather(weatherData);
    } else {
      // Assume city name format
      const weatherData = await getWeatherByCityName(userInput);
      displayWeather(weatherData);
    }
  }
});

async function getWeatherByCityName(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    alert('Could not fetch weather data. Please try again.');
  }
}

async function getWeatherByPincode(pincode) {
  // You can use a suitable API that supports pincode-based weather data fetching
  // Replace with actual implementation using an appropriate API
  const apiUrl = `https://example-api.com/weather?pincode=${pincode}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Weather data not found for the pincode');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data by pincode:', error.message);
    alert('Could not fetch weather data. Please try again.');
  }
}

function displayWeather(data) {
  const { main, weather, name, wind, sys, visibility, clouds } = data;
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const humidity = main.humidity;
  const pressure = main.pressure;
  const windSpeed = wind.speed;
  const windDirection = wind.deg;
  const uvIndex = visibility; // Example: using visibility as a proxy for UV index

  const weatherIcon = `https://openweathermap.org/img/w/${weather[0].icon}.png`;

  weatherResults.innerHTML = `
    <h2 class="temperature">${temperature}°C</h2>
    <img class="weather-icon" src="${weatherIcon}" alt="${weather[0].description}">
    <div class="details">
      <p>Feels like: ${feelsLike}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Air Pressure: ${pressure} hPa</p>
      <p>Wind: ${windSpeed} m/s ${convertWindDirection(windDirection)}</p>
      <p>UV Index: ${uvIndex}</p>
      <p>Weather Condition: ${weather[0].description}</p>
    </div>
    <div class="location">${name}</div>
  `;
}

// Function to convert wind direction degrees to compass direction
function convertWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45);
  return directions[index];
}
