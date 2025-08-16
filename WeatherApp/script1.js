document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cityInput = document.querySelector('.city-input');
    const searchBtn = document.querySelector('.search-btn');
    const weatherInfoSection = document.querySelector('.weather-info');
    const notFoundSection = document.querySelector('.not-found');
    const searchCitySection = document.querySelector('.search-city');
    const countryTxt = document.querySelector('.country-txt');
    const tempTxt = document.querySelector('.temp-txt');
    const conditionTxt = document.querySelector('.condition-txt');
    const humidityValueTxt = document.querySelector('.humidity-value-txt');
    const windValueTxt = document.querySelector('.wind-value-txt');
    const weatherSummaryImg = document.querySelector('.weather-summary-img');
    const currentDateTxt = document.querySelector('.current-date-txt');

    const apiKey = 'ceec25697463dcfadb1d7a41a450b2b4';

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city !== '') {
            updateWeatherInfo(city);
            cityInput.value = '';
            cityInput.blur();
        }
    });

    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city !== '') {
                updateWeatherInfo(city);
                cityInput.value = '';
                cityInput.blur();
            }
        }
    });

    // Fetch current weather data
    async function getFetchData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data; // contains 'cod' and other info
        } catch (error) {
            console.error('Error fetching data:', error);
            return { cod: "404" };
        }
    }

    // Fetch forecast data
    async function getForecastData(city) {
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        try {
            const response = await fetch(forecastApiUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching forecast:', error);
            return { cod: "404" };
        }
    }

    // Determine icon based on weather id
    function getWeatherIcon(weatherId) {
        weatherId = parseInt(weatherId);
        if (weatherId >= 200 && weatherId < 300) return 'thunderstorm.svg';
        if (weatherId >= 300 && weatherId < 500) return 'drizzle.svg';
        if (weatherId >= 500 && weatherId < 600) return 'rain.svg';
        if (weatherId >= 600 && weatherId < 700) return 'snow.svg';
        if (weatherId >= 700 && weatherId < 800) return 'atmosphere.svg';
        if (weatherId === 800) return 'clear.svg';
        if (weatherId > 800) return 'clouds.svg';
        return 'unknown.svg';
    }

    // Get current date in formatted string
    function getCurrentDate() {
        const currentDate = new Date();
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        };
        return currentDate.toLocaleDateString('en-GB', options);
    }

    // Get next 5 days forecast (excluding today)
    function getNextFiveDaysForecasts(forecastData) {
        const dailyData = {};
        forecastData.list.forEach(item => {
            const dateStr = item.dt_txt.split(' ')[0]; // 'YYYY-MM-DD'
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = [];
            }
            dailyData[dateStr].push(item);
        });
        const todayStr = new Date().toISOString().split('T')[0];

        // Filter days after today, up to 5 days ahead
        const relevantDays = Object.keys(dailyData).filter(day => {
            const diff = (new Date(day) - new Date(todayStr)) / (1000 * 60 * 60 * 24);
            return diff > 0 && diff <= 5;
        }).sort();

        const forecastItems = relevantDays.map(day => {
            const dataPoints = dailyData[day];
            // pick data at 12:00 or first available
            const middayData = dataPoints.find(dp => dp.dt_txt.includes('12:00:00')) || dataPoints[0];
            return {
                date: day,
                temp: middayData.main.temp,
                weatherId: middayData.weather[0].id
            };
        });
        return forecastItems;
    }

    // Render forecast
    function renderForecast(forecastItems) {
        const container = document.querySelector('.forecast-container-items');
        container.innerHTML = '';
        forecastItems.forEach(item => {
            const dateStr = new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            const temp = Math.round(item.temp) + ' °C';
            const icon = getWeatherIcon(item.weatherId);
            const forecastDiv = document.createElement('div');
            forecastDiv.className = 'forecast-item';
            forecastDiv.innerHTML = `
                <h5 class="forecast-item-date regular-txt">${dateStr}</h5>
                <img src="assets/weather/${icon}" class="forecast-item-img" />
                <h5 class="forecast-item-temp">${temp}</h5>
            `;
            container.appendChild(forecastDiv);
        });
    }

    // Show only the specified section
    function showDisplaySection(section) {
        [weatherInfoSection, searchCitySection, notFoundSection].forEach(sec => {
            sec.style.display = 'none';
        });
        section.style.display = 'flex';
    }

    // Main function to update weather info
    async function updateWeatherInfo(city) {
        const weatherData = await getFetchData(city);
        // Check if city is valid
        if (weatherData.cod !== 200) {
            showDisplaySection(notFoundSection);
            return;
        }

        const forecastData = await getForecastData(city);
        // Check if forecast is valid
        if (forecastData.cod !== 200 && forecastData.cod !== "200") {
            showDisplaySection(notFoundSection);
            return;
        }

        // Process forecast
        const forecastItems = getNextFiveDaysForecasts(forecastData);
        renderForecast(forecastItems);

        // Update current weather info
        countryTxt.textContent = weatherData.name;
        tempTxt.textContent = `${Math.round(weatherData.main.temp)}°C`;
        conditionTxt.textContent = weatherData.weather[0].main;
        humidityValueTxt.textContent = `${weatherData.main.humidity}%`;
        windValueTxt.textContent = `${weatherData.wind.speed} m/s`;
        currentDateTxt.textContent = getCurrentDate();
        weatherSummaryImg.src = `assets/weather/${getWeatherIcon(weatherData.weather[0].id)}`;

        showDisplaySection(weatherInfoSection);
    }

    // Initialize with search section
    showDisplaySection(searchCitySection);
});