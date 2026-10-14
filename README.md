# Everlasting Memories

A responsive photography website designed to showcase meaningful moments, beautiful portraits, couples, weddings, and editorial photography.

Live Website: https://ammardalla.github.io/EverlastingMemories/
GitHub Repository: https://github.com/Ammardalla/EverlastingMemories

# About the Project

Everlasting Memories is a photography portfolio website built to present photography services and showcase a collection of memorable moments through an elegant, modern design.

The project was originally developed using HTML and CSS and is being converted into a React application using reusable components, Tailwind CSS, and interactive features.
The website focuses on responsive design, clear navigation, image presentation, and a warm visual identity inspired by photography studios.

# Features

-Responsive Design: Adapts to mobile, tablet, and desktop screen sizes.
-Navigation Bar: Includes links to the Home, Gallery, About, and Contact sections.
-Mobile Navigation Menu: An interactive menu that opens and closes on smaller screens.
-Hero Section: Introduces the photography website with a background image and booking interface.
-Photography Gallery: Displays a collection of photography images.
-Gallery Filters: Allows visitors to filter images by category, including Portraits, Couples, Wedding, and Editorial.
-About Section: Introduces the photography studio and its values.
-Contact Section: Presents contact information and ways to get in touch.
-Responsive Layouts: Uses flexible layouts and responsive styling for different devices.
-Reusable React Components: Organizes the website into separate, maintainable components.

# Technologies Used

-HTML5 — Semantic website structure.
-CSS3 — Styling, transitions, and custom CSS variables.
-JavaScript (ES6+) — Website functionality and interactive behavior.
-React — Component-based user interface development.
-Vite — Development server and production build tool.
-Tailwind CSS v4 — Utility-first styling and responsive layouts.
-Git and GitHub — Version control and source code hosting.
-GitHub Pages — Website deployment and hosting.

# React Components

The website is organized into reusable components:
Header.jsx : Website branding, navigation links, and responsive mobile menu.
Hero.jsx : Hero section, introductory content, and booking interface.
Gallery.jsx : Photography gallery, category filters, and image layout.
About.jsx : Studio introduction, photography content, and values.
Contact.jsx : Contact information and contact section.
Footer.jsx : Footer content, navigation, social links, and copyright information.
The main App.jsx component combines these components to create the overall website layout.

# React Concepts

The project uses React concepts such as:
-Functional Components: Building the interface from independent, reusable components.
-JSX: Combining JavaScript with a declarative UI structure.
-Props and Data-Driven Rendering: Organizing and rendering content from JavaScript data where appropriate.
-useState: Managing interactive state, such as the mobile navigation menu and gallery filters.
-Event Handling: Responding to user interactions such as clicks.
-Conditional Rendering: Displaying different interface states based on the current state.
-Array Mapping: Generating navigation links and gallery items from arrays.
-Responsive Design: Creating layouts that adapt to different screen sizes.

# Design and Styling

The website uses a warm, photography-inspired color palette:
-Black — #151515
-Espresso — #291C14
-Orange — #C66A3D
-Gold — #D4A85A
-Terracotta — #B85C4A
-Cream — #EFE0CA
-Taupe — #A89584
-White — #FAF7F2
Tailwind CSS is used for utility-based styling, responsive breakpoints, spacing, layout, hover effects, and transitions. Custom CSS variables help maintain consistent colors throughout the website.

# Project Structure

EverlastingMemories/
    public/
        images/
            Gemini.jpg
            studio.jpg
            contact-img.jpg
            img1.jpg
            img2.jpg
            ...
    src/
        components/
            Header.jsx
            Hero.jsx
            Gallery.jsx
            About.jsx
            Contact.jsx
            Footer.jsx
        App.jsx
        index.css
        main.jsx
    index.html
    package.json
    vite.config.js
    README.md

Note: The structure above represents the main files discussed during development. Additional files, such as a separate gallery data file, also exist in the project. 


# Deployment

The website is deployed using GitHub Pages and the gh-pages package.
The Vite configuration includes a base path for the repository:
base: '/EverlastingMemories/',
To deploy the latest version:
npm run deploy
This command runs the production build and publishes the contents of the dist/ directory to the gh-pages branch.
The published website is available at:

https://ammardalla.github.io/EverlastingMemories/

# Future Improvements

-Potential improvements for future development include:
-Enhancing the booking experience and form validation.
-Improving accessibility and keyboard navigation.
-Adding more photography categories and gallery images.
-Optimizing images and loading performance.
-Connecting contact and booking forms to a backend or form service.
-Adding further animations and interactive features.

# Author

Ammardalla88

GitHub: https://github.com/Ammardalla88

Everlasting Memories — Capturing moments, preserving memories.