import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import Order from "../../domain/checkout/entity/order";
import OrderItem from "../../domain/checkout/entity/order_item";
import OrderRepository from "../../infrastructure/order/repository/sequelize/order.repository";

const router = Router();

function toDTO(order: Order) {
  return {
    id: order.id,
    customerId: order.customerId,
    total: order.total(),
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.price,
    })),
  };
}

// POST /orders
router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerId, items } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items are required" });
    }

    for (const item of items) {
      if (!item.name) return res.status(400).json({ error: "Each item must have a name" });
      if (!item.productId) return res.status(400).json({ error: "Each item must have a productId" });
      if (typeof item.price !== "number") return res.status(400).json({ error: "Each item price must be a number" });
      if (typeof item.quantity !== "number") return res.status(400).json({ error: "Each item quantity must be a number" });
    }

    const orderItems = items.map(
      (item: { id?: string; name: string; productId: string; price: number; quantity: number }) =>
        new OrderItem(
          item.id ?? uuid(),
          item.name,
          item.price,
          item.productId,
          item.quantity
        )
    );

    const order = new Order(uuid(), customerId, orderItems);
    const repository = new OrderRepository();
    await repository.create(order);

    return res.status(201).json(toDTO(order));
  } catch (error: unknown) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

// GET /orders
router.get("/", async (_req: Request, res: Response) => {
  try {
    const repository = new OrderRepository();
    const orders = await repository.findAll();
    return res.status(200).json(orders.map(toDTO));
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// GET /orders/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const repository = new OrderRepository();
    const order = await repository.find(req.params.id);
    return res.status(200).json(toDTO(order));
  } catch (error: unknown) {
    const msg = (error as Error).message;
    if (msg === "Order not found") {
      return res.status(404).json({ error: msg });
    }
    return res.status(500).json({ error: msg });
  }
});

// PUT /orders/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items are required" });
    }

    for (const item of items) {
      if (!item.name) return res.status(400).json({ error: "Each item must have a name" });
      if (!item.productId) return res.status(400).json({ error: "Each item must have a productId" });
      if (typeof item.price !== "number") return res.status(400).json({ error: "Each item price must be a number" });
      if (typeof item.quantity !== "number") return res.status(400).json({ error: "Each item quantity must be a number" });
    }

    const repository = new OrderRepository();
    const existing = await repository.find(req.params.id);

    const orderItems = items.map(
      (item: { id?: string; name: string; productId: string; price: number; quantity: number }) =>
        new OrderItem(
          item.id ?? uuid(),
          item.name,
          item.price,
          item.productId,
          item.quantity
        )
    );

    const updatedOrder = new Order(existing.id, existing.customerId, orderItems);
    await repository.update(updatedOrder);

    return res.status(200).json(toDTO(updatedOrder));
  } catch (error: unknown) {
    const msg = (error as Error).message;
    if (msg === "Order not found") {
      return res.status(404).json({ error: msg });
    }
    return res.status(400).json({ error: msg });
  }
});

// DELETE /orders/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const repository = new OrderRepository();
    await repository.delete(req.params.id);
    return res.status(204).send();
  } catch (error: unknown) {
    const msg = (error as Error).message;
    if (msg === "Order not found") {
      return res.status(404).json({ error: msg });
    }
    return res.status(500).json({ error: msg });
  }
});

export default router;
