# Frontend Developer - Code Challenge

## Objective
Develop a React application to connect to Binance (or other market API), fetch all assets, and display them in a live-updating table with specific headers.

## Features

### API Integration
- Connect to the Binance API (or any other market API) to fetch asset data.

### Live Data Updates
- Implement live updates for asset data.
- Highlight price changes with colors:
  - Red for a decrease in value (flashing for one second).
  - Green for an increase in value (flashing for one second).
  - Gray for no change in value.

### Table Display
- Create a table to display the asset data.
- Table headers include:
  - Name
  - Price (live data, highlight on change)
  - Market Value (Market cap) (live data)
  - 24h Change (live data) (if positive, green; if negative, red; default color otherwise)
  - 24h Sparkline Chart (if positive, green; if negative, red; default color otherwise)
- Display 10 tokens initially.
- Include infinite scrolling (render new tokens as you scroll).

### Project Setup
- Follow recommended React setup flow.
- Ensure the project is set up with TypeScript.

### Styling
- Use Tailwind CSS for styling.
- Avoid including any unnecessary libraries.

### Code Quality
- Adhere to SOLID principles.
- Maintain consistent and meaningful naming conventions.
- Include comprehensive code documentation.

### Testing
- Implement unit tests for critical components and functions.

### Deployment
- Publish your app on Netlify or similar.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
