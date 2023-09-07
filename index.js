// Import required modules
const http = require("http");
const fs = require("fs");
const axios = require("axios"); // Using axios for making HTTP requests

// Read the HTML template file
const homeFile = fs.readFileSync("home.html", "utf-8");

// Function to replace placeholders in the template
const replaceVal = (tempVal, orgVal) => {
  const { main, name, sys, weather } = orgVal;

  // Check if the required properties exist
  if (main && name && sys && weather && weather[0]) {
    return tempVal
      .replace("{%tempval%}", main.temp)
      .replace("{%tempmin%}", main.temp_min)
      .replace("{%tempmax%}", main.temp_max)
      .replace("{%location%}", name)
      .replace("{%country%}", sys.country)
      .replace("{%tempstatus%}", weather[0].main);
  } else {
    return "Weather data not available.";
  }
};

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    try {
      // Make an API request to OpenWeatherMap
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=20.9320&lon=77.7523&appid=0dcb3a837a16e2a043a17c9cbbcd948b`
              );

      const realTimeData = replaceVal(homeFile, response.data);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(realTimeData);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("An error occurred while fetching weather data.");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

// Start the server
const port = process.env.PORT || 8000;
server.listen(port, "127.0.0.1", () => {
  console.log(`Server is running on port ${port}`);
});
