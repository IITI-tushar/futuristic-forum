# Futuristic Forum

## Introduction

Welcome to the Futuristic Forum! This project aims to create a next-generation online discussion platform with an immersive and futuristic user experience. The forum leverages advanced technologies to provide a unique and engaging environment for users to interact and share ideas.

## Tech Stack

- **Next.js**: The React framework used for building the application.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Framer Motion**: A library for animations and interactions.
- **Three.js**: A library for 3D graphics and animations.
- **Radix UI**: A set of accessible and customizable UI components.
- **React Hook Form**: A library for managing form state and validation.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **OpenAI SDK**: Used for generating AI responses in the application.

## Features

- **Immersive UI**: A visually appealing and interactive user interface with 3D elements and animations.
- **AI Assistant**: An AI-powered assistant that helps users navigate the forum and provides recommendations.
- **Real-Time Activity Feed**: A live feed of user activities and discussions.
- **Category Showcase**: A section showcasing different discussion categories with dynamic content.
- **Responsive Design**: A fully responsive design that works seamlessly on various devices.

## Backend

The backend of the application includes an API route that processes neural data and generates AI responses. The main API route is located in `app/api/neural-interface/route.tsx`. This route handles the following tasks:

- Processing neural data to extract key metrics and generate a consciousness score.
- Generating AI responses based on user input and quantum parameters.
- Returning processed data and AI responses to the frontend.

## Frontend

The frontend of the application consists of various components that provide a rich user experience. Some of the key components include:

- **AI Assistant**: Located in `components/ai-assistant.tsx`, this component provides an AI-powered assistant that interacts with users.
- **Navbar**: Located in `components/navbar.tsx`, this component provides the main navigation for the application.
- **Footer**: Located in `components/footer.tsx`, this component provides the footer section of the application.
- **Hero Section**: Located in `components/hero-section.tsx`, this component provides the main hero section with 3D elements and animations.
- **Trending Discussions**: Located in `components/trending-discussions.tsx`, this component showcases trending discussions in the forum.

## Local Setup

To set up the application locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IITI-tushar/futuristic-forum.git
   cd futuristic-forum
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Build the application**:
   ```bash
   pnpm build
   ```

5. **Start the production server**:
   ```bash
   pnpm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` to access the application.

For more detailed information on the tech stack, features, and usage, please refer to the respective sections above.
