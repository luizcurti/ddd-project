import "reflect-metadata";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import app from "../api/app";
import { setupE2EDatabase, truncateAllTables } from "./setup/database.helper";

describe("Order E2E — /orders", () => {
  let sequelize: Sequelize;
  let customerId: string;
  let productId: string;

  beforeAll(async () => {
    sequelize = await setupE2EDatabase();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await truncateAllTables();

    // Create base customer and product for order tests
    const customerRes = await request(app)
      .post("/customers")
      .send({
        name: "Test Customer",
        address: { street: "Test Street", number: 1, zip: "00000-000", city: "Springfield" },
      });
    customerId = customerRes.body.id;

    const productRes = await request(app)
      .post("/products")
      .send({ name: "Test Product", price: 100 });
    productId = productRes.body.id;
  });

  // ─────────────────────────────────────────────
  // POST /orders
  // ─────────────────────────────────────────────

  describe("POST /orders", () => {
    it("should create an order and return 201", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [
            { name: "Item 1", productId, price: 100, quantity: 2 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.customerId).toBe(customerId);
      expect(res.body.total).toBe(200); // 100 * 2
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].name).toBe("Item 1");
      expect(res.body.items[0].unitPrice).toBe(100);
      expect(res.body.items[0].quantity).toBe(2);
      expect(res.body.items[0].total).toBe(200);
    });

    it("should create an order with multiple items", async () => {
      const product2Res = await request(app)
        .post("/products")
        .send({ name: "Product 2", price: 50 });
      const productId2 = product2Res.body.id;

      const res = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [
            { name: "Item A", productId, price: 100, quantity: 1 },
            { name: "Item B", productId: productId2, price: 50, quantity: 3 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.total).toBe(250); // 100*1 + 50*3
      expect(res.body.items).toHaveLength(2);
    });

    it("should return 400 when customerId is missing", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          items: [{ name: "Item", productId, price: 100, quantity: 1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when items is empty", async () => {
      const res = await request(app)
        .post("/orders")
        .send({ customerId, items: [] });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when quantity is zero", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item", productId, price: 100, quantity: 0 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/greater than zero/i);
    });

    it("should return 400 when item price is negative", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item", productId, price: -1, quantity: 1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/greater than or equal to zero/i);
    });
  });

  // ─────────────────────────────────────────────
  // GET /orders/:id
  // ─────────────────────────────────────────────

  describe("GET /orders/:id", () => {
    it("should return an order by id", async () => {
      const createRes = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item X", productId, price: 200, quantity: 1 }],
        });

      const id = createRes.body.id;

      const res = await request(app).get(`/orders/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.customerId).toBe(customerId);
      expect(res.body.total).toBe(200);
      expect(res.body.items[0].name).toBe("Item X");
    });

    it("should return 404 for a non-existing id", async () => {
      const res = await request(app).get("/orders/non-existing-id");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Order not found");
    });
  });

  // ─────────────────────────────────────────────
  // GET /orders
  // ─────────────────────────────────────────────

  describe("GET /orders", () => {
    it("should list all orders", async () => {
      await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item 1", productId, price: 50, quantity: 1 }],
        });
      await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item 2", productId, price: 75, quantity: 2 }],
        });

      const res = await request(app).get("/orders");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body.map((o: { customerId: string }) => o.customerId)).toEqual([
        customerId,
        customerId,
      ]);
    });

    it("should return an empty array when there are no orders", async () => {
      const res = await request(app).get("/orders");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────
  // PUT /orders/:id
  // ─────────────────────────────────────────────

  describe("PUT /orders/:id", () => {
    it("should update order items", async () => {
      const createRes = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Original Item", productId, price: 100, quantity: 1 }],
        });

      const id = createRes.body.id;

      const res = await request(app)
        .put(`/orders/${id}`)
        .send({
          items: [{ name: "Updated Item", productId, price: 150, quantity: 3 }],
        });

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(450); // 150 * 3
      expect(res.body.items[0].name).toBe("Updated Item");
      expect(res.body.items[0].quantity).toBe(3);
    });

    it("should update an order with multiple new items", async () => {
      const createRes = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Single Item", productId, price: 50, quantity: 1 }],
        });

      const id = createRes.body.id;

      const product2Res = await request(app)
        .post("/products")
        .send({ name: "Extra Product", price: 30 });
      const productId2 = product2Res.body.id;

      const res = await request(app)
        .put(`/orders/${id}`)
        .send({
          items: [
            { name: "Item 1", productId, price: 50, quantity: 2 },
            { name: "Item 2", productId: productId2, price: 30, quantity: 1 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(130); // 50*2 + 30*1
      expect(res.body.items).toHaveLength(2);
    });

    it("should return 404 when updating a non-existing order", async () => {
      const res = await request(app)
        .put("/orders/non-existing")
        .send({
          items: [{ name: "Item", productId, price: 10, quantity: 1 }],
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Order not found");
    });

    it("should return 400 when updating with empty items", async () => {
      const createRes = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item", productId, price: 100, quantity: 1 }],
        });

      const id = createRes.body.id;

      const res = await request(app)
        .put(`/orders/${id}`)
        .send({ items: [] });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  // ─────────────────────────────────────────────
  // DELETE /orders/:id
  // ─────────────────────────────────────────────

  describe("DELETE /orders/:id", () => {
    it("should delete an existing order and return 204", async () => {
      const createRes = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [{ name: "Item", productId, price: 10, quantity: 1 }],
        });

      const id = createRes.body.id;

      const deleteRes = await request(app).delete(`/orders/${id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/orders/${id}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 when deleting a non-existing order", async () => {
      const res = await request(app).delete("/orders/non-existing");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Order not found");
    });

    it("should delete an order and its associated items", async () => {
      const createRes = await request(app)
        .post("/orders")
        .send({
          customerId,
          items: [
            { name: "Item A", productId, price: 10, quantity: 1 },
            { name: "Item B", productId, price: 20, quantity: 2 },
          ],
        });

      const id = createRes.body.id;

      await request(app).delete(`/orders/${id}`);

      const allOrders = await request(app).get("/orders");
      expect(allOrders.body).toHaveLength(0);
    });
  });
});
