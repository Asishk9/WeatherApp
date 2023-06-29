const API_KEY = "fcde6436bfcc1c649f003bfc4578e576"; 
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/";

//Function to get the city input from the user
function searchWeather() {
    var cityInput = document.getElementById("cityInput");
    var city = cityInput.value;
    if (city.trim().length === 0) {
        alert("Please enter a city name.");
        return;
    }
    getWeatherByCity(city);
    getForecastFiveDay(city);
    getForecastToday(city);
}

// Function to execute when the page starts
window.addEventListener("load", () => {
  getCurrentLocation();
});

// Function to get weather data based on the user's current location
 function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url =`${API_BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const cityName = data.name;
          getWeatherByCity(cityName);
          getForecastFiveDay(cityName);
          getForecastToday(cityName);
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to fetch weather data from the API based on city name
function getWeatherByCity(city) {
  const url = `${API_BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Extract the necessary data from the API response
      const cityName = data.name;
      const weatherDescription = data.weather[0].description;
      const temperature = Math.round(data.main.temp);
      const feelsLike = Math.round(data.main.feels_like);
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = Math.round(data.wind.speed*3.6);
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { timeStyle: 'short' });
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { timeStyle: 'short' });

      // Update the DOM elements with the fetched data
      document.getElementById("cityName").innerText = cityName;
      document.getElementById("weatherDescription").innerText = weatherDescription;
      document.getElementById("temperature").innerText = `${temperature}°C`;
      document.getElementById("feelsLike").innerText = `${feelsLike}°C`;
      document.getElementById("weatherIcon").src = `./images/${data.weather[0].icon}.png`;
      document.getElementById("humidity").innerText = `${humidity}%`;
      document.getElementById("pressure").innerText = `${pressure} mbar`;
      document.getElementById("windSpeed").innerText = `${windSpeed} km/hr`;
      document.getElementById("sunrise").innerText = `${sunrise}`;
      document.getElementById("sunset").innerText = `${sunset}`;
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to fetch 5-day forecast data from the API based on city name
function getForecastFiveDay(city) {
    const url = `${API_BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const forecastList = data.list;
  
        for (let i = 0; i < 5; i++) {
          const forecast = forecastList[i * 8]; 
          const date = new Date(forecast.dt * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
          var d = new Date(forecast.dt * 1000);
          var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
          var dayName = days[d.getDay()];
          const weatherDescription = forecast.weather[0].description;
          const temperature = Math.round(forecast.main.temp);
          const icon = forecast.weather[0].icon;
  
          document.getElementById(`weather_icon${i + 1}`).src = `./images/${icon}.png`;
          document.getElementById(`date${i + 1}`).innerText = date;
          document.getElementById(`day${i + 1 }`).innerText = dayName;
          document.getElementById(`weatherDescription${i + 1}`).innerText = weatherDescription;
          document.getElementById(`temp${i + 1}`).innerText = `${temperature}°C`;
        }
      })
      .catch(error => {
        console.error("Error fetching forecast data:", error);
      });
}

// Function to fetch 24-hr forecast data from the API based on city name
function getForecastToday(city) {
    const url = `${API_BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const forecastList = data.list;
  
        for (let i = 0; i < 8; i++) {
          const forecast = forecastList[i]; 
          const time = new Date(forecast.dt * 1000).toLocaleString([], { timeStyle: 'short'});
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const temperature = Math.round(forecast.main.temp);
          const icon = forecast.weather[0].icon;
          const wspeed = Math.round(forecast.wind.speed*3.6);
  
          document.getElementById(`weathericon${i + 1}`).src = `./images/${icon}.png`;
          document.getElementById(`time${i + 1}`).innerText = time;
          document.getElementById(`tmpr${i + 1}`).innerText = `${temperature}°C`;
          document.getElementById(`speed${i + 1}`).innerText = `${wspeed} km/hr`
        }
      })
      .catch(error => {
        console.error("Error fetching forecast data:", error);
      });
}
