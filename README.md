# Food Delivery API

A NestJS-based REST API for a food delivery service. This application connects Customers, Restaurant Owners, and Administrators to facilitate ordering meals from restaurants.

## 📋 Prerequisites

Before starting the project, ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** or **MariaDB** Database Server (v8.0+ recommended)

## ⚙️ Configuration

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   The application uses environment-specific configuration files (e.g., `.env.development`, `.env.test`).

   Create a `.env.development` file in the root directory by copying the provided sample:

   ```bash
   cp sample.env .env.development
   ```

4. **Update Environment Variables**:
   Open `.env.development` and configure your database credentials and other settings:

   ```dotenv
   # Database Configuration
   DB_SERVER_PORT=3306
   DB_SERVER_HOST=localhost
   DB_SERVER_USERNAME=your_db_user
   DB_SERVER_PASSWORD=your_db_password
   DATABASE=food_delivery_app

   # JWT Security
   JWT_SECRET=your_super_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=7d

   # Logging
   LOG_LEVEL=info
   ```

5. **Database Setup**:
   Ensure the database specified in `DATABASE` exists in your MySQL server.
   ```sql
   CREATE DATABASE food_delivery_app;
   ```
   _Note: If `synchronize` is set to `false` in `src/app/app.module.ts`, you may need to enable it temporarily to generate the database tables on the first run, or run migrations if applicable._

## 🚀 How to Start

### Development Mode

To start the application in development mode with hot-reloading:

```bash
npm run start:dev
```

The server will start (default port: `8080`) and the API will be accessible at `http://localhost:8080/api`.

### Production Build

```bash
npm run build
npm run start:prod
```

## 📖 How to Use

### API Prefix

All API endpoints are prefixed with `/api`.

### User Roles

The system controls access using three main roles:

1.  **Customer**:
    - Browse restaurants.
    - View meals.
    - Place and track orders.
    - Manage their own profile.

2.  **Restaurant Owner**:
    - Create and manage their Restaurants.
    - Add/Edit Meals.
    - Manage Order statuses (Processing, In Route, Delivered).

3.  **Administrator**:
    - Full access to Users, Restaurants, and Meals.
    - Can block/unblock entities.

### Accessing the API

Since this is a backend-only project, use an API client like **Postman** or **Insomnia** to interact with the endpoints.

1.  **Sign Up / Login**: Use the auth endpoints to get an access token.
2.  **Authentication**: Include the token in the `Authorization` header for protected routes:
    ```
    Authorization: Bearer <your_access_token>
    ```

## 📂 Project Structure

- `src/app`: Main application module and setup.
- `src/auth`: Authentication logic (JWT, Guards).
- `src/user`: User management (Customer/Owner profiles).
- `src/restaurant`: Restaurant and Meal management.
- `src/order`: Order processing and status workflows.
- `src/common`: Shared utilities, filters, and guards.
- `logs/`: Application logs (generated at runtime).

## 🏆 Technical Features Showcase

This project showcases advanced architectural patterns and Senior-level engineering practices:

- **🔐 Advanced Authentication & Security**:
  - **Authentication**: Implemented robust **OAuth2 / JWT** strategies using `passport-jwt` for secure stateless access.
  - **RBAC (Role-Based Access Control)**: Granular permissions using custom `@Roles()` decorators and `Guards`.
  - **Global Serialization**: Centralized `ClassSerializerInterceptor` to automatically strip sensitive data (e.g., passwords) from responses.

- **🏗️ Scalable Architecture (SOLID)**:
  - **Modular Design**: Feature-based standard folder structure following Domain-Driven Design principles.
  - **SOLID Compliance**: Strict adherence to **Single Responsibility Principle** (e.g., separating `Customer` and `Owner` controllers to isolated files).
  - **Global Exception Handling**: Centralized `AllExceptionsFilter` ensuring consistent error schemas system-wide.

- **💾 Robust Data Handling**:
  - **Declarative Transactions**: Utilizes `typeorm-transactional` for **Spring Boot-like `@Transactional`** management, ensuring ACID compliance without boilerplate.
  - **Hybrid Database Access**: Combines TypeORM for standard CRUD with **Raw SQL** for high-performance complex queries.
  - **Soft Deletes**: Implements data retention policies using soft delete mechanisms.

- **⚙️ Operational Excellence**:
  - **DTO Validation**: Strict input validation using `class-validator` and `class-transformer` pipes.
  - **Structured Logging**: Integrated `winston` logger for production-grade observability.
  - **Dynamic Headers**: Context-aware response headers (`X-App-Version`, `X-Platform`).
