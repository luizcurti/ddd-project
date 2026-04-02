import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../infrastructure/customer/repository/sequelize/customer.model";
import ProductModel from "../../infrastructure/product/repository/sequelize/product.model";
import OrderModel from "../../infrastructure/order/repository/sequelize/order.model";
import OrderItemModel from "../../infrastructure/order/repository/sequelize/order-item.model";

export const ALL_MODELS = [CustomerModel, ProductModel, OrderModel, OrderItemModel];

export function createE2ESequelize(): Sequelize {
  return new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "ddd_project",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    logging: false,
  });
}

export async function setupE2EDatabase(): Promise<Sequelize> {
  const sequelize = createE2ESequelize();
  await sequelize.addModels(ALL_MODELS);
  await sequelize.sync({ force: true });
  return sequelize;
}

export async function truncateAllTables(): Promise<void> {
  // Order matters due to FK constraints
  await OrderItemModel.destroy({ where: {}, truncate: false });
  await OrderModel.destroy({ where: {}, truncate: false });
  await CustomerModel.destroy({ where: {}, truncate: false });
  await ProductModel.destroy({ where: {}, truncate: false });
}
