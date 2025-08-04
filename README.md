# Ultimate Travel App

A budget-friendly travel planning application that helps users find and compare routes across various transportation modes, build itineraries, and export them.

## Features

*   **Multi-Modal Route Search**: Find routes for bus, rail, and mixed modes.
*   **Location Autocomplete**: Powered by Nominatim for easy city search.
*   **Detailed Route Information**: View estimated price, duration, departure/arrival times, CO2 emissions, and intermediate stops for transit routes.
*   **Itinerary Builder**: Add preferred routes to a personal itinerary.
*   **CSV Export**: Export your compiled itinerary to a CSV file.
*   **Dynamic Sorting**: Sort search results by duration, cost, CO2, or departure time.

## Setup and Run

To get this project up and running locally, follow these steps:

### 1. Clone the repository

\`\`\`bash
git clone <your-repository-url>
cd ultimate-travel-app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables

Create a `.env` file in the root of your project and add your Transitland API key:

\`\`\`
NEXT_PUBLIC_TRANSITLAND_API_KEY="YOUR_TRANSITLAND_API_KEY_HERE"
\`\`\`

Replace `"YOUR_TRANSITLAND_API_KEY_HERE"` with your actual API key from Transitland.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technologies Used

*   **Next.js**: React framework for building web applications.
*   **React**: Frontend library for building user interfaces.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **shadcn/ui**: Reusable UI components.
*   **Zustand**: State management library for the itinerary.
*   **Nominatim API**: For location search autocomplete.
*   **Transitland API (OTP)**: For public transit route planning.
