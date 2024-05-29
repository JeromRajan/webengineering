<script>
	import WeatherChart from './WeatherChart.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { weatherDataStore } from '../stores/store.js';

	let interval;
	let address = 'Bern';
	let searchAddress = address;
	let weatherData = null;
	let error = null;

	const openRouteServiceApiKey = '5b3ce3597851110001cf6248183c479bd4214503ae217b5094a8665f';
	const openWeatherMapApiKey = '2f8b083e4fa92aada5bc125032faf189';

	const fetchWeather = async () => {
		try {
			const [lon, lat] = await getCoordinates(address);
			const data = await getWeather(lat, lon);
			const weatherDataWithDate = { ...data, date: new Date() };
			weatherDataStore.update(currentData => [...currentData, weatherDataWithDate]);
			weatherData = data;
			error = null;
		} catch (e) {
			error = e.message;
		}
	};

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
		return await response.json();
	};

	const changeAddress = () => {
		address = searchAddress;
		fetchWeather();
	};

	onMount(() => {
		fetchWeather(); // Initial fetch
		interval = setInterval(fetchWeather, 60000); // Fetch every minute
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<main>
	<div class="container">
		<h1>Wetter App</h1>
		<div class="input-group">
			<input type="text" bind:value={searchAddress} placeholder="Adresse eingeben" />
			<button on:click={changeAddress}>Wetter anzeigen</button>
		</div>
		{#if weatherData}
			<div class="weather-card">
				<h2>Wetter in {address}</h2>
				<p>Temperatur: {weatherData.main.temp} °C</p>
				<p>Luftdruck: {weatherData.main.pressure} hPa</p>
				<p>Luftfeuchtigkeit: {weatherData.main.humidity} %</p>
				<!-- SVG für Wetteranzeige -->
				<svg width="100" height="100">
					{#if weatherData.weather[0].main === 'Clear'}
						<circle cx="50" cy="50" r="30" class="sun" />
					{:else if weatherData.weather[0].main === 'Clouds'}
						<circle cx="50" cy="50" r="30" class="cloud" />
					{:else}
						<circle cx="50" cy="50" r="30" class="rain" />
					{/if}
				</svg>
			</div>
			<WeatherChart />
		{/if}

		{#if error}
			<p class="error">{error}</p>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Roboto', sans-serif;
		background-color: #f4f4f9;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2em;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	}

	h1 {
		text-align: center;
		color: #333;
	}

	.input-group {
		display: flex;
		justify-content: center;
		margin-bottom: 1em;
	}

	input {
		padding: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ddd;
		border-radius: 4px;
		flex: 1;
	}

	button {
		padding: 0.5em 1em;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #0056b3;
	}

	.weather-card {
		padding: 1em;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		text-align: center;
		margin-bottom: 1em;
	}

	.weather-card svg {
		margin-top: 1em;
	}

	.sun {
		fill: yellow;
		animation: spin 5s linear infinite;
	}

	.cloud {
		fill: gray;
		animation: float 5s ease-in-out infinite;
	}

	.rain {
		fill: blue;
		animation: drop 1s linear infinite;
	}

	.error {
		color: red;
		text-align: center;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes drop {
		0% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(10px);
		}
	}
</style>