import express from "express";
import customerRouter from "./routes/customer.routes";
import productRouter from "./routes/product.routes";
import orderRouter from "./routes/order.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

export default app;
