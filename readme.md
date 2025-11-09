# DDD Project

A comprehensive implementation of Domain-Driven Design (DDD) principles using Node.js, TypeScript, and modern development practices.

## 📋 Overview

This project demonstrates a clean architecture following DDD patterns with:
- **Domain Layer**: Core business logic and entities
- **Infrastructure Layer**: Database persistence with Sequelize ORM
- **Complete Test Coverage**: 154 tests with 100% coverage
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
npm test                # Run all tests (SQLite in memory)
npm run test:coverage   # Run tests with coverage report
npm run lint           # Check code quality
npm run docker:up      # Start PostgreSQL database (optional)
npm run docker:down    # Stop all containers (optional)
npm run db:reset       # Reset database (optional)
```

## 🗄️ Database Setup

This project supports multiple database configurations:

- **Testing**: SQLite in memory (automatic, no setup required)
- **Development**: PostgreSQL via Docker (optional, for development database)
- **Production**: PostgreSQL (configurable via environment variables)

### Quick Database Setup (Optional)

If you want to test with PostgreSQL in development:

```bash
# Start PostgreSQL database
npm run docker:up

# Stop PostgreSQL database  
npm run docker:down
```

**Note**: Tests always use SQLite in memory, so Docker is not required for testing.

## � Prerequisites

* **Node.js** (version >= 20.x)
* **TypeScript** (version >= 5.8.x)
* **npm** or **yarn**
* **Docker & Docker Compose** (optional, for development database only)

## 📁 Project Structure

```
src/
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
└── infrastructure/                  # Infrastructure Layer
    ├── customer/                    # Customer persistence
    ├── product/                     # Product persistence
    └── order/                       # Order persistence
```

## 🧪 Testing

- **Test Framework**: Jest with SWC compiler
- **Coverage**: 100% across all metrics (statements, branches, functions, lines)
- **Test Types**: Unit tests for all domains and infrastructure
- **Total Tests**: 154 passing tests

## 🔧 Code Quality

- **Linting**: ESLint 8.57.1 with TypeScript support
- **Type Safety**: Strict TypeScript configuration
- **Code Standards**: Consistent formatting and naming conventions

## 📦 Key Dependencies

### Core Technologies
- **TypeScript**: 5.8.2 - Type-safe JavaScript development
- **Node.js**: >= 23.x - JavaScript runtime
- **Jest**: 29.7.0 - Testing framework with 100% coverage
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
- ✅ Order processing with items and calculations
- ✅ Reward points system for customers
- ✅ Event-driven notifications
- ✅ Full test coverage with comprehensive scenarios
- ✅ Type-safe database operations
- ✅ Clean architecture following SOLID principles
