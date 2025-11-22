# Gupta Furniture - Advanced SEO Website

A high-performance, SEO-optimized website built with Next.js for Gupta Furniture in Nashik.

## Features

-   **Dynamic Routing**: Location-first and Service-first strategies.
-   **Programmatic SEO**: Automated metadata and schema generation for thousands of potential pages.
-   **Lead Generation**: Context-aware contact forms on every page.
-   **Admin Dashboard**: View leads at `/admin/leads`.
-   **Minimalist Design**: Premium pink palette with responsive UI.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Database**: MongoDB (Mongoose)
-   **Styling**: Vanilla CSS (Modules & Global Variables)

## Getting Started

1.  **Prerequisites**: Node.js 20.9.0 or later.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Ensure `.env.local` contains your `MONGODB_URI`.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Project Structure

-   `app/`: App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `lib/`: Data models and database connection.
-   `models/`: Mongoose schemas.
