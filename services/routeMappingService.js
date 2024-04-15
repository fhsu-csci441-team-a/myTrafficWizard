/**
 * RouteMappingService is a class designed to handle the calculation and management
 * of routes between two geographic points. It uses geographic coordinates to determine
 * distances and generate waypoints along a route.
 *
 * Example Usage:
 * --------------
 * const RouteMappingService = require('./RouteMappingService'); // Adjust path as needed
 *
 * // Create an instance with start and end points defined by latitude and longitude.
 * let routeService = new RouteMappingService("48.8588443,2.2943506", "40.748817,-73.985428"); 
 *
 * // Get the total distance of the route in meters.
 * console.log("Total distance: " + routeService.getRouteDistance() + " meters");
 *
 * // Generate waypoints along the route every 100,000 meters.
 * const waypoints = routeService.generateWayPoints(100000);
 * console.log("Waypoints:");
 * waypoints.forEach((wp, index) => {
 *     console.log(`Waypoint ${index}: Latitude ${wp[1]}, Longitude ${wp[0]}`);
 * });
 */

const geolib = require('geolib');
const turf = require('@turf/turf');

class RouteMappingService {
    #start;
    #end;
    #startLatitude
    #startLongitude
    #endLatitude
    #endLongitude


    constructor(start, end) {
        this.setRoute(start, end);
    }

    setRoute(start, end) {
        this.#start = start;
        this.#end = end;

        this.#setLatitudeAndLongitude();
    }

    #setLatitudeAndLongitude() {
        const splitStart = this.#start.split(',');
        const splitEnd = this.#end.split(',');

        this.#startLatitude = splitStart[0];
        this.#startLongitude = splitStart[1];

        this.#endLatitude = splitEnd[0];
        this.#endLongitude = splitEnd[1];

    }

    getRouteDistance() {

        const startCoordinates = { 'latitude': this.#startLatitude, 'longitude': this.#startLongitude };
        const endCoordinates = { 'latitude': this.#endLatitude, 'longitude': this.#endLongitude };

        const distanceInMeters = geolib.getDistance(startCoordinates, endCoordinates);

        return distanceInMeters;

    }

    generateDynamicNumberOfPoints(routeDistanceInMeters, interval = 100000) {
        const maxIntermediateWaypoints = 2;
        const dynamicNumberOfPoints = Math.floor(routeDistanceInMeters / interval);

        return Math.min(dynamicNumberOfPoints, maxIntermediateWaypoints);
    }

    generateWayPoints(interval = 100000) {
        const routeDistance = this.getRouteDistance();
        const numberOfPoints = this.generateDynamicNumberOfPoints(routeDistance, interval);

        const startLatitude = parseFloat(this.#startLatitude);
        const startLongitude = parseFloat(this.#startLongitude);
        const endLatitude = parseFloat(this.#endLatitude);
        const endLongitude = parseFloat(this.#endLongitude);


        const start = turf.point([startLongitude, startLatitude]);
        const end = turf.point([endLongitude, endLatitude]);
        const line = turf.lineString([start.geometry.coordinates, end.geometry.coordinates]);

        const waypoints = [start.geometry.coordinates]; // Start with the start point
        for (let i = 1; i < numberOfPoints; i++) {
            const segmentDistance = interval * i;
            const waypoint = turf.along(line, segmentDistance, { units: 'meters' });
            waypoints.push(waypoint.geometry.coordinates);
        }

        waypoints.push(end.geometry.coordinates); // Add the end point

        return waypoints;
    }
}

module.exports = RouteMappingService;
