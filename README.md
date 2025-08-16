# WeatherApp



Weather Forecast App - README
🌦️ Overview
A responsive weather application that provides current weather conditions and a 5-day forecast for any city worldwide. Built with HTML, CSS, and JavaScript using the OpenWeatherMap API.

✨ Features
Current Weather Display:

City name and country

Temperature in Celsius

Weather condition (e.g., Sunny, Rainy)

Humidity percentage

Wind speed

Current date

5-Day Forecast:

Day of week and date

Predicted temperature

Weather condition icon

Includes today + next 4 days

User-Friendly Interface:

Clean, responsive design

Search by city name

Error handling for invalid cities

🛠️ Installation
Clone the repository:

bash
git clone https://github.com/yourusername/weather-app.git
Get an API key from OpenWeatherMap

Add your API key to the JavaScript file:

javascript
const apiKey = 'your_api_key_here';
Open index.html in your browser

📁 File Structure
text
weather-app/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # Main JavaScript file
└── assets/
    └── weather/        # Weather icons
        ├── clear.svg
        ├── clouds.svg
        ├── drizzle.svg
        └── ...
🌐 API Usage
This app uses the OpenWeatherMap API:

Current weather endpoint: api.openweathermap.org/data/2.5/weather

5-day forecast endpoint: api.openweathermap.org/data/2.5/forecast

🎨 Customization
You can easily customize:

Colors in style.css

Number of forecast days in script.js

Temperature unit (Celsius/Fahrenheit)

📱 Responsive Design
The app works on:

Mobile phones

Tablets

Desktop computers

📜 License
This project is open source and available under the MIT License.

🙏 Credits
Weather data provided by OpenWeatherMap

Weather icons from [Your Icon Source]
