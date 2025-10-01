## Project Summary: los-honorables

This project, "los-honorables," is a Node.js application written in TypeScript that aims to democratize access to Chilean legislative information. It retrieves data from the Senate and the Chamber of Deputies of Chile, processes it, and stores it in Firestore. The project uses AI (planned to be DeepSeek v3.1) to generate simple explanations and categorizations of complex legislative projects.

### Objective:
Facilitate access for the common citizen to legislative data from the Chilean National Congress, processing complex information using AI to generate simple explanations and categorizations.

### Audience:
Chilean citizens interested in following legislative activity in an accessible and understandable way.

### Architecture:
REST API + Firebase Backend + AI Processing.

### Key Technologies:

*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** Firestore (NoSQL)
*   **Cloud Platform:** Firebase (including Cloud Functions for scheduled tasks)
*   **AI:** DeepSeek v3.1 (planned) for explanations, categorization, pattern analysis, and summaries.
*   **Data Processing:** `xml2js` and `jsdom` for converting XML data from government APIs to JSON.
*   **Package Manager:** pnpm

### Data Flow (6 Steps):
1.  **Consult Public APIs:** Obtain data from the Senate and Chamber of Deputies.
2.  **XML to JSON Conversion:** Transform governmental XML data into structured JSON.
3.  **Firestore Storage:** Persist structured data.
4.  **AI Processing:** Generate explanations and categorizations using DeepSeek v3.1.
5.  **AI Response Cache:** Store AI responses to avoid re-queries.
6.  **Exposure via REST API:** Public access to processed information.

### External APIs:
*   **Chamber of Deputies:** `https://opendata.camara.cl/` (XML format, 32 documented endpoints)
*   **Senate:** `https://tramitacion.senado.cl/wspublico/` (XML format)

### Project Structure:

The project is structured with a clear separation of concerns, including:

*   `src/api`: For the REST API, with controllers and middlewares (new structure).
*   `src/config`: For centralized configurations (e.g., AI config).
*   `src/data`: For fetching data from external APIs (legacy).
*   `src/functions`: For Firebase Cloud Functions (scheduled and manual).
*   `src/models`: For data models and types (Firestore collections, repositories, general types).
*   `src/services`: For business logic, including AI processing (`deepseek-client.ts`, `explanation-generator.ts`, `categorization-engine.ts`), data collection (`senado-client.ts`, `diputados-client.ts`), and caching (`ai-cache.ts`).
*   `src/utils`: For utility functions (e.g., `xmlToJson.ts`, `firestoreUtils.ts`).
*   `src/server`: Express server configuration.
*   `src/routes`: Legacy API endpoints.

### API Endpoints (Base URL: `http://localhost:6000`):
*   `/projects`: For legislative projects and votes.
*   `/periodosLegislativos`: For legislative periods.
*   `/senadores`: For senator information.
*   `/diputados`: For deputy information.
*   Additional routes: `/legislativos`, `/servicioSala`, `/votaciones`.

### Development Workflow:

*   **Start (production):** `npm run start`
*   **Development (hot reload):** `npm run dev` (uses `tsx`)
*   **Build:** `npm run build` (compiles TypeScript to `dist/`)
*   **Test:** `npm run test` (uses Jest)
*   **Lint:** `npm run lint` (uses ESLint)
*   **Deploy:** `npm run deploy` (builds and deploys to Firebase)
*   **Process Endpoint:** `npm run procesarEndpoint` (script for processing and validating endpoints)

### Current Status:

The project is in the early stages of development. The basic structure is in place, and some core components like XML to JSON conversion and basic Firebase configuration are complete. Many features, especially the AI integration and data processing pipelines, are still under development. The `CONTEXT.md` file provides a detailed roadmap for future development, highlighting immediate priorities such as implementing the AI explanation engine, TypeScript types for legislative entities, and external API clients.

### Future Improvements:
*   **Short-term:** Complete API routes, full Firestore storage, comprehensive unit tests.
*   **Medium-term:** Integrate DeepSeek v3.1, implement scheduled Cloud Functions, automatic categorization, citizen query API.
*   **Long-term:** Web dashboard, mobile app, legislative alerts, predictive voting analysis, social media integration.