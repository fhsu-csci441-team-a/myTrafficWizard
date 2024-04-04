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

### Creating Trip Alert Requests 
To create a trip alert request:
   - Fill out the required fields – required fields include:
     - Departure Date and Time
     - Departure Address
     - Destination Address
     - Email - your email will be the default channel for trip alerts
   - Choose your preferred additional notification channels (SMS, Slack, Discord)
   - See further instructions in the Multi-Channel Notifications section
   - Click "Submit" to save your trip alert request.

### Multi-Channel Notifications
My Traffic Wizard supports notifications through multiple channels including:
   - Email: Receive alerts via email.
     - Enter the email address where you’d like to receive notifications
   - SMS: Receive alerts on your mobile phone.
     - Enter your mobile phone number
     - Select your mobile service provider from the drop-down list
   - Slack: Receive alerts in your Slack workspace.
     - To use this option, first join our Slack workspace here: [Slack Workspace Invite Link](https://join.slack.com/t/mytrafficwizard/shared_invite/zt-2g2s9gfvauNMAbZQA8ukM_b~a2FeeZw)
     - Then click on your profile username, go to the 3-dot drop-down menu icon, and select “Copy member ID”
     - Now you can enter this Slack User ID into the Slack field
   - Discord: Receive alerts in your Discord server.
     - To use this option, first join our Discord server here: [Discord Server Invite Link](https://discord.gg/wcjQKr4NCZ)
     - Then click on your cogwheel settings icon, navigate to the “Advanced” sub-menu in your App Settings menu, and turn on the “Developer Mode” toggle
     - Then, when you right-click on your user profile image, you will be able to select “Copy User ID”
     - Now you can enter this Discord User ID into the Discord field

You can select one or multiple channels for receiving notifications.

## License

All Rights Reserved © Nicole-Rene Newcomb, Tyler Anderson, Philip Baldwin, and Jacob Spalding

## Credits

- This project was developed by Nicole-Rene Newcomb, Tyler Anderson, Philip Baldwin, and Jacob Spalding.
- Special thanks to our Professor, Dr. Mike Mireku Kwakye.
