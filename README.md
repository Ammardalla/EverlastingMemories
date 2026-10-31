# Everlasting Memories

**Capturing Moments, Preserving Memories.**

Everlasting Memories is a full-stack photography website designed to showcase professional photography services, display memorable moments, manage bookings, and sell photography-related products through an elegant and responsive online experience.

The project combines a modern React frontend with a Node.js backend, database integration, authentication, and Stripe payment processing.

🌐 **Live Website:** https://ammardalla.github.io/EverlastingMemories/  
💻 **GitHub Repository:** https://github.com/Ammardalla/EverlastingMemories

---

## About the Project

Everlasting Memories started as a photography portfolio built with HTML and CSS and has evolved into a full-stack web application.

The website provides visitors with an elegant way to explore photography collections, discover available services, book photography sessions, and purchase products.

It also includes user authentication and administrative functionality to support the management of the platform.

The application is designed with a warm visual identity inspired by professional photography studios, combining modern layouts, responsive components, and interactive features.

## Features

### 1. Photography Portfolio
- Responsive homepage with an elegant hero section.
- Photography gallery featuring portraits, couples, weddings, and editorial photography.
- Category-based gallery filtering.
- Dedicated About and Contact sections.
- Responsive navigation bar with a mobile menu.
- Optimized image presentation and reusable gallery components.

### 2. Photography Booking System
- Interactive booking form.
- Multiple photography packages.
- Customer information collection.
- Booking date and service selection.
- Cash payment option at the shop.
- Online payment through Stripe Checkout.
- Booking confirmation experience.
- Backend integration for saving booking information.

### 3. Online Shop
- Dedicated shop page.
- Products loaded from the backend API.
- Product cards with images, descriptions, and prices.
- Shopping cart functionality.
- Product checkout through Stripe.
- Order success and cancellation navigation.

### 4. Authentication System
- User registration and login.
- Better Auth integration.
- Session-based authentication.
- Protected application functionality.
- User authentication connected to the backend.

### 5. Admin Dashboard
- Dedicated admin page.
- Administrative access based on configured user permissions.
- Foundation for managing platform content and operations.

### 6. Payment Integration
- Stripe Checkout integration.
- Secure server-side checkout session creation.
- Support for photography booking payments.
- Support for shop product payments.
- Booking and order metadata passed through checkout sessions.
- Configurable success and cancellation URLs.

### 7. Responsive User Interface
- Mobile-first responsive layouts.
- Interactive navigation and interface elements.
- Reusable React components.
- Tailwind CSS utility-based styling.
- Consistent colors, spacing, and typography.
- Responsive layouts for mobile, tablet, and desktop.

---

## Technologies Used

### Frontend
- **HTML5** — Semantic page structure.
- **CSS3** — Custom styling, transitions, and CSS variables.
- **JavaScript (ES6+)** — Application logic and interactions.
- **React** — Component-based user interface.
- **Vite** — Development server and production build tool.
- **Tailwind CSS v4** — Utility-first styling and responsive layouts.
- **React Router** — Client-side navigation and routing.

### Backend
- **Node.js** — JavaScript runtime.
- **Express.js** — Backend API and server-side routing.
- **Better Auth** — Authentication and session management.
- **Drizzle ORM** — Database queries and schema management.
- **Neon PostgreSQL** — Hosted relational database.
- **Stripe** — Online checkout and payment processing.

### Development and Deployment
- **Git** — Version control.
- **GitHub** — Source code hosting.
- **GitHub Actions** — Automated frontend build and deployment.
- **GitHub Pages** — Frontend hosting.
- **Render** — Backend hosting.
- **Neon** — Database hosting.

---

## Application Architecture

Everlasting Memories uses a frontend/backend architecture.

### Frontend
The React application is responsible for:
- Displaying the photography portfolio.
- Rendering the gallery and filtering images.
- Managing client-side navigation.
- Displaying shop products and shopping cart information.
- Collecting booking and customer information.
- Communicating with backend API endpoints.
- Redirecting customers to Stripe Checkout.

### Backend
The Express server handles:
- API requests.
- Booking creation and processing.
- Product data retrieval.
- Checkout session creation.
- Authentication endpoints.
- Database communication.
- Server-side payment and pricing logic.

### Database
The application uses PostgreSQL through Neon, with Drizzle ORM for database operations.

Database-related functionality supports application data such as users, products, and bookings.

### Payment Processing
Stripe Checkout handles online payments for photography bookings and shop purchases. Checkout sessions are created by the backend rather than directly by the frontend.

---

## React Components

The frontend is organized into reusable components and pages.

| Component / Page | Responsibility |
|---|---|
| `Header.jsx` | Website branding, navigation, and mobile menu. |
| `Hero.jsx` | Homepage introduction and booking interface. |
| `Gallery.jsx` | Photography gallery and category filters. |
| `About.jsx` | Studio introduction and values. |
| `Contact.jsx` | Contact information and communication section. |
| `Footer.jsx` | Footer content, links, and copyright information. |
| `BookingModal.jsx` | Booking form and payment method selection. |
| `Login.jsx` | User login interface. |
| `Signup.jsx` | User registration interface. |
| `Shop.jsx` | Product listing and shopping experience. |
| `ProductCard.jsx` | Individual product presentation. |
| `BookingSuccess.jsx` | Booking payment confirmation page. |
| `ShopSuccess.jsx` | Shop checkout confirmation page. |

The main `App.jsx` component combines the application pages and configures client-side routing.

*Note: Additional components, utilities, and backend modules are included in the project.*

---

## React Concepts and Development Practices

The project uses several React concepts and modern development practices:

- **Functional Components:** Building the interface from reusable components.
- **JSX:** Combining JavaScript logic with declarative UI.
- **Props:** Passing information between components.
- **useState:** Managing interactive application state.
- **useEffect:** Handling side effects and data fetching.
- **Event Handling:** Responding to user interactions.
- **Conditional Rendering:** Displaying different interface states.
- **Array Mapping:** Rendering dynamic navigation links and product collections.
- **React Router:** Managing application navigation.
- **API Integration:** Communicating with the Express backend.
- **Form Handling:** Collecting and submitting user information.
- **Responsive Design:** Supporting different screen sizes.

---

## Design and Styling

The website uses a warm, photography-inspired color palette.

| Color | Hex Code |
|---|---|
| Black | `#151515` |
| Espresso | `#291C14` |
| Orange | `#C66A3D` |
| Gold | `#D4A85A` |
| Terracotta | `#B85C4A` |
| Cream | `#EFE0CA` |
| Taupe | `#A89584` |
| White | `#FAF7F2` |

Tailwind CSS is used for responsive layouts, spacing, hover effects, transitions, and component styling. Custom CSS variables help maintain a consistent design system.

---

## Project Structure

The project is organized into separate frontend and backend directories.

```text
EverlastingMemories/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── client/
│   ├── public/
│   │   ├── images/
│   │   └── 404.html
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── auth.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

*The structure above is a simplified overview. Additional configuration, database schema, migration, and application files may exist.*

---

## Deployment

The application is deployed using separate hosting services for the frontend, backend, and database.

| Application Part | Hosting Service |
|---|---|
| Frontend | GitHub Pages |
| Backend API | Render |
| PostgreSQL Database | Neon |
| Payment Processing | Stripe |

### Frontend Deployment

The frontend is hosted on GitHub Pages.

The Vite configuration uses the repository base path:

```js
base: '/EverlastingMemories/',
```

GitHub Actions is configured to build the React application and deploy the generated `client/dist` directory to GitHub Pages when changes are pushed to the `main` branch.

Live frontend:

https://ammardalla.github.io/EverlastingMemories/

### Backend Deployment

The Express backend is hosted on Render.

Backend URL:

https://everlastingmemories.onrender.com

The frontend communicates with the backend using the configured API URL.

### Database

The application uses a PostgreSQL database hosted on Neon.

Database connection settings are configured through environment variables on the backend hosting service.

### Environment Variables

Sensitive configuration values must be stored in environment variables and should never be committed to the repository.

Examples of backend environment variables:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
CLIENT_URL=
STRIPE_SECRET_KEY=
ADMIN_USER_ID=
```

Frontend configuration:

```env
VITE_API_URL=
```

Use the appropriate production values in the hosting dashboards and local development values in private `.env` files.

---

## Local Development

### Prerequisites

- Node.js
- npm
- Git
- A Neon PostgreSQL database
- Stripe account for payment functionality

### 1. Clone the Repository

```bash
git clone https://github.com/Ammardalla/EverlastingMemories.git
cd EverlastingMemories
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create the required `.env` files for the frontend and backend.

Configure the database connection, authentication settings, Stripe secret key, and frontend/backend URLs.

Never publish real API keys, database credentials, or authentication secrets.

### 5. Start the Backend

From the `server` directory, run the development command configured in `server/package.json`.

```bash
npm run dev
```

### 6. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

The Vite development server will display the local frontend URL in the terminal.

---

## Security Considerations

- Sensitive credentials are managed through environment variables.
- Stripe secret keys are used on the backend.
- Checkout sessions are created server-side.
- Booking and payment-related data are processed through backend endpoints.
- Authentication is handled through Better Auth.
- Database access is managed through the backend.

---

## Future Improvements

Potential future enhancements include:

- More advanced admin dashboard functionality.
- Booking management and customer history.
- Improved booking validation and duplicate-submission protection.
- Order management and payment status tracking.
- Email notifications for bookings and purchases.
- Enhanced accessibility and keyboard navigation.
- Image optimization and lazy loading.
- Additional gallery categories and photography collections.
- Improved SEO and metadata.
- Automated testing and error monitoring.

---

## Author

**Ammardalla88**

GitHub: https://github.com/Ammardalla88
portfolio: https://my-portfolio-am.netlify.app

---

**Everlasting Memories — Capturing moments, preserving memories.**