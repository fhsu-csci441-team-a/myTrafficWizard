# MyTrafficWizard

MyTrafficWizard is a web-based application designed to provide users with real-time traffic and weather updates for their planned trips. Users can submit trip details, including departure and destination addresses, and choose their preferred notification channels such as email, SMS, Slack, or Discord. The application then sends timely alerts to users about traffic conditions, estimated travel times, incidents along the route, and weather forecasts.

## Features

- **Trip Alert Requests**: Users can submit trip alert requests by providing departure and destination addresses, plus their contact information.
  
- **Multi-Channel Notifications**: Notifications can be sent through various channels including email, SMS, Slack, and Discord.

- **Real-time Traffic and Weather Updates**: The application fetches real-time traffic data from external traffic APIs and weather data from weather APIs to provide users with accurate updates.

- **Scheduled Alerts**: Users can schedule alerts for future trips, and the system automatically sends notifications at the specified times.

## Architecture Overview

MyTrafficWizard follows an extended MVC design pattern, consisting of the following main subsystems:
- **Models**: Manage data - executes CRUD operations on the database and interfaces with third-party APIs.
  
- **Views**: Interface directly with the user - renders the UI and captures user input through form submissions.
  
- **Controllers**: Serve as the orchestrators of other components - processes user input and coordinates the application's logic.

- **Routes**: Specify the application's accessible endpoints - associates endpoints with controller actions.
  
- **Services**: Offer support to the primary subsystems - includes utilities that enhance the application's functionality.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/my-traffic-wizard.git`
2. Navigate to the project directory: `cd my-traffic-wizard`
3. Install dependencies: `npm install`
4. Set up environment variables such as API keys for TomTom, Gmail, Slack, Discord, etc.
5. Set up a database for the application to use, and retrieve the necessary URL to access it.

## Usage

### Local Development
1. Start the application: `npm start`
2. Access the application via your web browser at `http://localhost:3000`
3. Submit trip details and choose notification preferences.
4. Receive real-time traffic and weather updates for your planned trips.

### Live Website
Visit the live website hosted on [Render](https://mytrafficwizard.onrender.com) to use the application without setting it up locally. Please note, though, that the Render App sleeps after a period of inactivity. If not used recently, it may take a minute or two to load. Please be patient while the Render App wakes up.

## License

All Rights Reserved © Nicole-Rene Newcomb, Tyler Anderson, Philip Baldwin, and Jacob Spalding

## Credits

- This project was developed by Nicole-Rene Newcomb, Tyler Anderson, Philip Baldwin, and Jacob Spalding.
- Special thanks to our Professor, Dr. Mike Mireku Kwakye.
