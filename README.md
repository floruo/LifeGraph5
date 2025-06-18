# LifeGraph 5 Frontend

A React-based frontend for exploring and querying lifelog image data using tags and countries, powered by a SPARQL endpoint.

## Features

- **Tag and Country Search:** Select tags and countries to filter image URIs.
- **AND/OR Query Mode:** Combine tags using intersection (AND) or union (OR).
- **SPARQL Query Display:** View the generated SPARQL query.
- **Result Overlay:** Click on a URI to view it in an overlay.
- **Caching:** Tags and countries are cached in localStorage for faster access.
- **Tailwind CSS:** Modern, responsive UI with Inter font.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/LSC25.git
   cd LSC25
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure SPARQL Endpoint:**
   - By default, the app queries `http://localhost:8080/query/sparql`.
   - To change, edit `src/utils/sparql.js` and update `sparqlEndpointUrl`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

```
src/
  App.jsx                # Main app component
  components/
    TagSelector.jsx      # Tag selection UI
    CountrySelector.jsx  # Country selection UI
  utils/
    sparql.js            # SPARQL query utilities
  main.jsx               # Entry point
  index.css              # Tailwind CSS imports
index.html               # HTML template
vite.config.js           # Vite config
package.json             # Project metadata and scripts
```

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code

## Customization

- **Styling:** Uses Tailwind CSS and Inter font (see `index.html` and `index.css`).
- **SPARQL Queries:** Modify or extend queries in `src/utils/sparql.js` as needed.

## License

MIT

