# LifeGraph 5 Frontend

A React-based frontend for exploring and querying lifelog image data using tags and countries, powered by a SPARQL endpoint.

## Features

- Query a configurable SPARQL endpoint
- Filter results by tags, country, city, category, location, date, time, caption, clip, and OCR
- Interactive UI for building and running SPARQL queries
- Responsive design using Tailwind CSS
- Modular component structure for easy customization

## IMPORTANT: Changes Made to the LSC23 Data

- Replaced whitespace in tag URIs with underscore
- Removed leading whitespace for categories

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/floruo/LSC25.git
   cd LSC25
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure SPARQL Endpoint:**
   - By default, the app queries `http://localhost:8080/query/sparql`.
   - To change, edit `SPARQL_ENDPOINT` in `src/config.js`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

```
src/
  App.jsx      # Main app component
  config.js    # App configuration
  index.css    # Tailwind CSS imports
  main.jsx     # Entry point
  components/
    RenderFilters.jsx    # Renders all filter components
    ResultDisplay.jsx    # Displays query results
    ResultOverlay.jsx    # Overlay for results
    SparqlQueryArea.jsx  # SPARQL query editor and runner
    filter/
      CaptionFilter.jsx  # Filter by caption
      ClipFilter.jsx     # Filter by clip
      DateFilter.jsx     # Filter by date
      OcrFilter.jsx      # Filter by OCR
      TimeFilter.jsx     # Filter by time
    selector/
      CategorySelector.jsx # Select category
      CitySelector.jsx     # Select city
      CountrySelector.jsx  # Select country
      LocationSelector.jsx # Select location
      TagSelector.jsx      # Select tags
  utils/
  sparql.js       # SPARQL query utilities
  index.html      # HTML template
  vite.config.js  # Vite config
  package.json    # Project metadata and scripts
```

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code

## Customization

- **Filter Order:** Modify the order of filters in `src/config.js` and update `FILTER_ORDER`.
- **Styling:** Uses Tailwind CSS and Inter font (see `index.html` and `index.css`).
- **SPARQL Queries:** Modify or extend queries as needed.
- **Filters & Selectors:** Add or customize filter/selector components in `src/components/filter/` and `src/components/selector/`.
- **DRES Configuration:** Create a `config.local.json` in `src` and add the user and password in the following format:
   ```json
   {
      "DRES_USER": "MyUserName",
      "DRES_PASSWORD": "MyPassword"
   }
   ```

## License

MIT
