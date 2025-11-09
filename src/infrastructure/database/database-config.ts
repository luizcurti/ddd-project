import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../customer/repository/sequelize/customer.model";
import ProductModel from "../product/repository/sequelize/product.model";
import OrderModel from "../order/repository/sequilize/order.model";
import OrderItemModel from "../order/repository/sequilize/order-item.model";

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private sequelize: Sequelize;

  private constructor() {
    this.createConnection();
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  private createConnection(): void {
    const isTest = process.env.NODE_ENV === 'test';
    
    if (isTest) {
      // SQLite in memory for tests
      this.sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
    } else {
      // PostgreSQL for development/production
      this.sequelize = new Sequelize({
        dialect: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "ddd_project",
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        logging: process.env.NODE_ENV === 'development' ? console.log : false, // eslint-disable-line no-console
        sync: { force: false },
        define: {
          timestamps: true,
          underscored: true,
        },
      });
    }

    // Add all models
    this.sequelize.addModels([
      CustomerModel,
      ProductModel,
      OrderModel,
      OrderItemModel,
    ]);
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Database connection established successfully.'); // eslint-disable-line no-console
      
      if (process.env.NODE_ENV !== 'test') {
        await this.sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.'); // eslint-disable-line no-console
      }
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error); // eslint-disable-line no-console
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('✅ Database connection closed successfully.'); // eslint-disable-line no-console
    } catch (error) {
      console.error('❌ Error closing database connection:', error); // eslint-disable-line no-console
      throw error;
    }
  }

  public async truncate(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      await this.sequelize.truncate({ cascade: true, restartIdentity: true });
    }
  }
}

export default DatabaseConfig;