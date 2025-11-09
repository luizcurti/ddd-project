import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import { v4 as uuid } from "uuid";
import Customer from "../../customer/entity/customer";

export default class OrderService {
  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new Error("Order must have at least one item");
    }
    
    const order = new Order(uuid(), customer.id, items);
    const rewardPoints = Math.floor(order.total() / 2);
    customer.addRewardPoints(rewardPoints);
    
    return order;
  }

  static total(orders: Order[]): number {
    if (orders.length === 0) {
      return 0;
    }
    
    return orders.reduce((acc, order) => acc + order.total(), 0);
  }
}
