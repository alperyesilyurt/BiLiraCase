# BiLira Case

This is a sample React application developed for the BiLira case. It connects to a market API (Binance) to fetch asset data and display them in a live-updating table with specific headers.

## Features

- **API Integration:** Connects to the Binance API to fetch asset data.
- **Live Data Updates:** Implements live updates for asset data.
- **Highlight Price Changes:** Red for a decrease in value, green for an increase in value, and gray for no change.
- **Table Display:** Displays asset data in a table with headers including name, price, market value, 24h change, and 24h sparkline chart.
- **Infinite Scrolling:** Renders new tokens as you scroll.
- **Styling:** Uses Tailwind CSS for styling.

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alperyesilyurt/BiLiraCase.git
   cd BiLiraCase
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Build the project for production:**
   ```bash
   npm run build
   ```

## Usage

Once the project is set up, the application will fetch asset data from the Binance API and display it in a live-updating table.

## Code Structure

- **src/**: Contains all source files for the application.
  - **components/**: Contains React components.
    - `AssetTable.tsx`: Main table component displaying asset data.
    - `Loading.tsx`: Loading spinner component.
    - `ErrorComp.tsx`: Error display component.
    - `Sparkline.tsx`: Component for displaying sparkline charts.
  - **hooks/**: Custom hooks used in the project.
    - `fetchAssets.ts`: Hook for fetching asset data from the API.
  - **types/**: TypeScript types and interfaces.
  - **assets/**: Static assets like images.
  - **App.tsx**: Main application component.
  - **index.tsx**: Entry point for the React application.

## Documentation

### Components

#### `AssetTable`

The `AssetTable` component fetches and displays asset data in a table format. It highlights price changes with colors and implements infinite scrolling.

- **Props:** None
- **State:**
  - `page`: Current page number for infinite scrolling.
  - `assets`: Array of asset data.
  - `isLoading`: Loading state.
  - `isError`: Error state.
  - `previousPrices`: Object to store previous prices for highlighting.
  - `highlightedAssets`: Object to store asset symbols with their highlight color.
- **Methods:**
  - `loadAssets(page: number)`: Fetches asset data for the given page.
  - `updateAssets()`: Fetches updated asset data and highlights price changes.

#### `Loading`

The `Loading` component displays a loading spinner.

#### `ErrorComp`

The `ErrorComp` component displays an error message.

#### `Sparkline`

The `Sparkline` component displays a sparkline chart for asset price changes.

### Hooks

#### `fetchAssets`

The `fetchAssets` hook fetches asset data from the Binance API.

- **Parameters:**
  - `page: number`: The page number to fetch.
- **Returns:**
  - `Promise<Asset[]>`: A promise that resolves to an array of asset data.

### Types

#### `Asset`

Type definition for an asset object.

- **Fields:**
  - `symbol: string`: The symbol of the asset.
  - `lastPrice: string`: The last price of the asset.
  - `priceChangePercent: string`: The price change percentage of the asset.
  - `quoteVolume: string`: The quote volume of the asset.
  - `priceChanges: number[]`: An array of price changes for the asset.

## Testing

Unit tests are implemented for critical components and functions using Jest and React Testing Library.

- **Run tests:**
  ```bash
  npm test
  ```

## Deployment

The application can be deployed on Netlify or similar platforms. Ensure you set up the correct build command (`npm run build`) and publish directory (`build/`).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact [alperesilyurt52@gmail.com].
