const fetch = require('node-fetch');
global.fetch = fetch;

const { getCoordinates, getWeather } = require('../public/app');

// Mock API Responses
const mockCoordinatesResponse = {
    features: [
        {
            geometry: {
                coordinates: [7.444606, 46.947313]
            }
        }
    ]
};

const mockWeatherResponse = {
    main: {
        temp: 10,
        pressure: 1013,
        humidity: 80
    },
    weather: [
        { main: 'Clear' }
    ]
};

// Mock fetch implementation
jest.spyOn(global, 'fetch').mockImplementation((url) => {
    if (url.includes('openrouteservice')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCoordinatesResponse)
        });
    } else if (url.includes('openweathermap')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockWeatherResponse)
        });
    }
    return Promise.reject(new Error('not found'));
});

test('getCoordinates should return correct coordinates', async () => {
    const coords = await getCoordinates('Bern');
    expect(coords[1]).toBeCloseTo(46.947, 3);  // Expected latitude for Bern
    expect(coords[0]).toBeCloseTo(7.444606, 3);  // Expected longitude for Bern
});

test('getWeather should return weather data', async () => {
    const weather = await getWeather(52.5200, 13.4050);
    expect(weather).toHaveProperty('main');
    expect(weather.main).toHaveProperty('temp');
    expect(weather.main).toHaveProperty('pressure');
    expect(weather.main).toHaveProperty('humidity');
    expect(weather.main.temp).toBe(10);
    expect(weather.main.pressure).toBe(1013);
    expect(weather.main.humidity).toBe(80);
});
