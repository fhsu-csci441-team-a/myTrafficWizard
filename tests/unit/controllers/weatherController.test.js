const WeatherController = require('../../../controllers/weatherController');
const ReverseGeocode = require('../../../services/reverseGeocode');
const RouteMappingService = require('../../../services/routeMappingService');
require('dotenv').config();

//const apiKeyWeather = 'ljBGQOoZnk05ad4M5fL8Hh9EzKsE8x9o'
const apiKeyWeather = '66DXvEick6s22tdNJwq5NK466xltSab3';
const apiKeyTomTom = 'EoNThFWZ8woKP8Jk0GchI42XP2GFa0C0';
const start = '38.873333,-99.343333';
const end = '38.8538652,-99.2737776';

const weatherController = new WeatherController(start, end, apiKeyWeather, apiKeyTomTom);
const reverseGeocode = new ReverseGeocode(apiKeyTomTom);
const routeMappingService = new RouteMappingService(start, end);

const wayPoints = routeMappingService.generateWayPoints();

async function main() {
    const result = await weatherController.getWeatherMessage()
    console.log(result.html);
}


main();