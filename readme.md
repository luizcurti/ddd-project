# DDD Project

A comprehensive implementation of Domain-Driven Design (DDD) principles using Node.js, TypeScript, and modern development practices.

## 📋 Overview

This project demonstrates a clean architecture following DDD patterns with:
- **Domain Layer**: Core business logic and entities
- **Infrastructure Layer**: Database persistence with Sequelize ORM
- **REST API Layer**: Express HTTP server exposing full CRUD endpoints
- **Complete Test Coverage**: 88 unit tests + 52 E2E tests (140 total)
- **Code Quality**: ESLint configuration with TypeScript support
- **Event-Driven Architecture**: Domain events and handlers

## 🚀 Getting Started

### Quick Start (Testing Only)

1. **Clone this repository:**
```bash
git clone https://github.com/luizcurti/ddd-project.git
cd ddd-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run tests:**
```bash
npm test
```

### Development with Database

1. **Setup environment (optional):**
```bash
cp .env.example .env
```

2. **Start PostgreSQL database (optional):**
```bash
npm run docker:up
```

3. **Install dependencies and run tests:**
```bash
npm install
npm test  # Tests always use SQLite in memory
```

4. **Optional: Access PgAdmin at http://localhost:8080**
   - Email: `admin@ddd-project.com`
   - Password: `admin`

### Available Commands

```bash
npm test                # Run all unit tests (SQLite in-memory, no Docker needed)
npm run test:coverage   # Run unit tests with coverage report
npm run test:e2e        # Run E2E tests against real PostgreSQL (requires Docker)
npm run dev             # Start the API server in watch mode
npm run start           # Start the API server
npm run lint            # Check code quality
npm run docker:up       # Start PostgreSQL database
npm run docker:down     # Stop all containers
npm run db:reset        # Reset database
```

## 🗄️ Database Setup

This project supports multiple database configurations:

- **Unit Tests**: SQLite in-memory (automatic, no setup required)
- **E2E Tests**: PostgreSQL via Docker (**required** for `npm run test:e2e`)
- **Development / Production**: PostgreSQL (configurable via environment variables)

### Quick Database Setup

```bash
# Start PostgreSQL (required for E2E tests and local development)
npm run docker:up

# Stop PostgreSQL
npm run docker:down
```

**Note**: Unit tests always use SQLite in-memory, so Docker is **not** required for `npm test`.

## � Prerequisites

* **Node.js** (version >= 20.x)
* **TypeScript** (version >= 5.8.x)
* **npm** or **yarn**
* **Docker & Docker Compose** (required for E2E tests and local development database)

## 📁 Project Structure

```
src/
├── api/                             # REST API Layer (Express)
│   ├── app.ts                       # Express app setup
│   ├── server.ts                    # HTTP server bootstrap
│   └── routes/                      # Route handlers
│       ├── customer.routes.ts
│       ├── product.routes.ts
│       └── order.routes.ts
├── domain/                          # Domain Layer (Business Logic)
│   ├── @shared/                     # Shared domain components
│   │   ├── event/                   # Event system
│   │   └── repository/              # Repository interfaces
│   ├── customer/                    # Customer domain
│   │   ├── entity/                  # Customer entity
│   │   ├── factory/                 # Customer factory
│   │   ├── repository/              # Customer repository interface
│   │   └── value-object/            # Address value object
│   ├── product/                     # Product domain
│   │   ├── entity/                  # Product entities
│   │   ├── event/                   # Product events and handlers
│   │   ├── factory/                 # Product factory
│   │   ├── repository/              # Product repository interface
│   │   └── service/                 # Product services
│   └── checkout/                    # Order domain
│       ├── entity/                  # Order and OrderItem entities
│       ├── factory/                 # Order factory
│       ├── repository/              # Order repository interface
│       └── service/                 # Order services
├── infrastructure/                  # Infrastructure Layer
│   ├── customer/                    # Customer persistence
│   ├── product/                     # Product persistence
│   └── order/                       # Order persistence
└── e2e/                             # E2E Tests (real PostgreSQL)
    ├── setup/
    │   ├── global-setup.ts          # Jest global setup (waits for PostgreSQL)
    │   └── database.helper.ts       # DB helpers for E2E tests
    ├── customer.e2e.spec.ts
    ├── product.e2e.spec.ts
    └── order.e2e.spec.ts
```

## 🧪 Testing

- **Test Framework**: Jest with SWC compiler
- **Unit Tests**: 88 tests — SQLite in-memory, no Docker required (`npm test`)
- **E2E Tests**: 52 tests — real PostgreSQL via Docker (`npm run test:e2e`)
- **Total**: 140 passing tests

### Running E2E Tests

E2E tests exercise the full HTTP stack (Express → Sequelize → PostgreSQL) using Supertest.

```bash
# 1. Start the database
npm run docker:up

# 2. Run E2E tests
npm run test:e2e
```

The global setup waits for PostgreSQL to be ready before running any test suite.

## 🌐 REST API

Start the server with `npm run dev` (or `npm start`). Base URL: `http://localhost:3000`.

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/customers` | Create a customer |
| `GET` | `/customers` | List all customers |
| `GET` | `/customers/:id` | Get a customer by ID |
| `PUT` | `/customers/:id` | Update name and/or address |
| `DELETE` | `/customers/:id` | Delete a customer |

**POST /customers body:**
```json
{
  "name": "John Smith",
  "address": { "street": "Main St", "number": 42, "zip": "10001", "city": "New York" }
}
```

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create a product |
| `GET` | `/products` | List all products |
| `GET` | `/products/:id` | Get a product by ID |
| `PUT` | `/products/:id` | Update name and/or price |
| `DELETE` | `/products/:id` | Delete a product |

**POST /products body:**
```json
{ "name": "Laptop", "price": 1200 }
```

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create an order |
| `GET` | `/orders` | List all orders |
| `GET` | `/orders/:id` | Get an order by ID |
| `PUT` | `/orders/:id` | Replace order items |
| `DELETE` | `/orders/:id` | Delete an order |

**POST /orders body:**
```json
{
  "customerId": "<uuid>",
  "items": [
    { "name": "Item 1", "productId": "<uuid>", "price": 100, "quantity": 2 }
  ]
}
```

### Health Check

```
GET /health  →  { "status": "ok" }
```

## 🔧 Code Quality

- **Linting**: ESLint 8.57.1 with TypeScript support
- **Type Safety**: Strict TypeScript configuration
- **Code Standards**: Consistent formatting and naming conventions

## 📦 Key Dependencies

### Core Technologies
- **TypeScript**: 5.8.2 - Type-safe JavaScript development
- **Node.js**: >= 20.x - JavaScript runtime
- **Express**: 5.x - HTTP server and routing
- **Jest**: 29.7.0 - Testing framework
- **Supertest**: E2E HTTP assertions
- **Sequelize**: 6.37.7 - ORM for database operations
- **ESLint**: 8.57.1 - Code quality and linting

### Database Support
- **PostgreSQL**: 15+ - Production database (via Docker)
- **SQLite3**: 5.1.7 - In-memory testing database
- **pg**: 8.13.1 - PostgreSQL driver for Node.js

### Development Tools
- **@swc/core**: 1.9.3 - Fast TypeScript/JavaScript compiler
- **Docker Compose**: Container orchestration for development
- **dotenv**: 16.4.5 - Environment variable management

## 🏗 Architecture Patterns

### Domain-Driven Design (DDD)
- **Entities**: Customer, Product, Order, OrderItem
- **Value Objects**: Address
- **Aggregates**: Clear boundaries and consistency
- **Domain Events**: Product creation events
- **Factories**: Object creation patterns
- **Services**: Domain and application services

### Repository Pattern
- Clean separation between domain and infrastructure
- Interface-based design for testability
- Sequelize ORM for database persistence

### Event-Driven Architecture
- Domain events for cross-cutting concerns
- Event dispatcher for decoupled communication
- Handler pattern for event processing

## 🎯 Features

- ✅ Complete customer management with addresses
- ✅ Product catalog with pricing and variants
- ✅ Order processing with items and total calculations
- ✅ Reward points system for customers
- ✅ Event-driven notifications
- ✅ Full REST API (Express) with CRUD endpoints
- ✅ 88 unit tests + 52 E2E tests (140 total)
- ✅ Type-safe database operations
- ✅ Clean architecture following SOLID principles
