const geolib = require('geolib');
const turf = require('@turf/turf');

class RouteManager {
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

    generateDynamicNumberOfPoints(routeDistanceInMeters, maxWaypoints = 2) {
        const fixedIntervalInMeters = routeDistanceInMeters / (maxWaypoints + 1);
        return Math.min(maxWaypoints, Math.floor(routeDistanceInMeters / fixedIntervalInMeters));
    }

    generateWayPoints() {
        const routeDistance = this.getRouteDistance();
        const numberOfPoints = this.generateDynamicNumberOfPoints(routeDistance);

        const startLatitude = parseFloat(this.#startLatitude);
        const startLongitude = parseFloat(this.#startLongitude);
        const endLatitude = parseFloat(this.#endLatitude);
        const endLongitude = parseFloat(this.#endLongitude);


        const start = turf.point([startLongitude, startLatitude]);
        const end = turf.point([endLongitude, endLatitude]);
        const line = turf.lineString([start.geometry.coordinates, end.geometry.coordinates]);
        const totalDistance = turf.length(line, { units: 'meters' });
        const waypoints = [start.geometry.coordinates]; // Start with the start point

        for (let i = 1; i <= numberOfPoints; i++) {
            const segmentDistance = (totalDistance / (numberOfPoints + 1)) * i;
            const waypoint = turf.along(line, segmentDistance, { units: 'meters' });
            waypoints.push(waypoint.geometry.coordinates);
        }

        waypoints.push(end.geometry.coordinates); // Add the end point

        return waypoints;
    }
}

module.exports = RouteManager;
