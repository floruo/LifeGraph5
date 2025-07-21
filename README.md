![LifeGraph](https://github.com/user-attachments/assets/31c54ac4-0660-488a-900f-13ce18207680)

# LifeGraph 5 Frontend

A React-based frontend for exploring and querying lifelog image data using tags, countries, and more, powered by a SPARQL endpoint.


## Features

- Query a configurable SPARQL endpoint
- Filter results by tags, country, city, category, location, date, time, caption, CLIP embedding, and OCR
- Interactive UI for building and running SPARQL queries
- Responsive design using Tailwind CSS
- Modular component structure for easy customization
- Submissions to the Distributed Retrieval Evaluation Server ([DRES](https://github.com/dres-dev/DRES)) via integrated client
- Logging support via LogViewer
- Uses Vite for fast development and build


## Filters & Selectors

- **Selectors:**
   - Category
   - City
   - Country
   - Location
   - Tag
- **Filters:**
  - Caption
  - CLIP
  - Date
  - OCR
  - Time


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

### Setting Up MeGraS

MeGraS (MediaGraph Store) is required to run the SPARQL endpoint and is available as a Docker container or from source. For instructions, follow the [README](http://megras.org).


## Project Structure

```
src/
  App.jsx                # Main app component
  config.js              # App configuration
  config.local.json      # Local config overrides
  index.css              # Tailwind CSS styles
  main.jsx               # Entry point
  components/
    ContextOverlay.jsx   # Contextual overlays
    DresClient.jsx       # DRES integration
    LogViewer.jsx        # Logging UI
    RenderFilters.jsx    # Renders all filters
    ResultDisplay.jsx    # Displays query results
    ResultOverlay.jsx    # Overlay for results
    SparqlQueryArea.jsx  # SPARQL query builder
    filter/
      CaptionFilter.jsx
      ClipFilter.jsx
      DateFilter.jsx
      OcrFilter.jsx
      TimeFilter.jsx
    selector/
      CategorySelector.jsx
      CitySelector.jsx
      CountrySelector.jsx
      LocationSelector.jsx
      TagSelector.jsx
  utils/
    sparql.js            # SPARQL query utilities
openapi/
  DRES/                  # DRES OpenAPI client
    client/
      ...                # Client code and docs
```

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code


## Customization

- **Filter Order:** Modify the order and inclusion of filters in `src/config.js` and update `FILTER_ORDER`.
- **Styling:** Uses Tailwind CSS and Inter font (see `index.html` and `index.css`).
- **SPARQL Queries:** Modify or extend queries as needed.
- **Filters & Selectors:** Add or customize filter/selector components in `src/components/filter/` and `src/components/selector/`.
- **DRES Configuration:** Update the `config.local.json` in `src` and add the user and password in the following format:
   ```json
   {
      "DRES_USER": "MyUserName",
      "DRES_PASSWORD": "MyPassword"
   }
   ```

## License

See LICENSE for details.
