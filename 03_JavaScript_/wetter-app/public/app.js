const openRouteServiceApiKey = '5b3ce3597851110001cf6248183c479bd4214503ae217b5094a8665f';
const openWeatherMapApiKey = '2f8b083e4fa92aada5bc125032faf189';

const getCoordinates = async (address) => {
    const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${openRouteServiceApiKey}&text=${address}`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates;
    } else {
        throw new Error('Address not found');
    }
};

const getWeather = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherMapApiKey}`);
    const data = await response.json();
    return data;
};

const fetchWeather = async () => {
    const address = document.getElementById('address').value;
    try {
        const [lon, lat] = await getCoordinates(address);
        const weatherData = await getWeather(lat, lon);
        displayWeather(weatherData, address);
    } catch (e) {
        alert(e.message);
    }
};

const displayWeather = (weatherData, address) => {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>Wetter in ${address}</h2>
        <p>Temperatur: ${weatherData.main.temp} °C</p>
        <p>Luftdruck: ${weatherData.main.pressure} hPa</p>
        <p>Luftfeuchtigkeit: ${weatherData.main.humidity} %</p>
        <svg width="100" height="100">
          ${weatherData.weather[0].main === 'Clear' ? '<circle cx="50" cy="50" r="30" class="sun" />' : ''}
          ${weatherData.weather[0].main === 'Clouds' ? '<circle cx="50" cy="50" r="30" class="cloud" />' : ''}
          ${weatherData.weather[0].main !== 'Clear' && weatherData.weather[0].main !== 'Clouds' ? '<circle cx="50" cy="50" r="30" class="rain" />' : ''}
        </svg>
      `;
};

//Für Jtests
module.exports = { getCoordinates, getWeather };