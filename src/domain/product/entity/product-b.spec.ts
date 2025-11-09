import ProductB from "./product-b";

describe("ProductB unit tests", () => {
  it("should create a valid product B", () => {
    const product = new ProductB("1", "Product B", 100);

    expect(product.id).toBe("1");
    expect(product.name).toBe("Product B");
    expect(product.price).toBe(200); // price * 2
  });

  it("should throw error when id is empty", () => {
    expect(() => {
      new ProductB("", "Product B", 100);
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new ProductB("1", "", 100);
    }).toThrowError("Name is required");
  });

  it("should throw error when price is negative", () => {
    expect(() => {
      new ProductB("1", "Product B", -1);
    }).toThrowError("Price must be greater than or equal to zero");
  });

  it("should change name", () => {
    const product = new ProductB("1", "Product B", 100);
    product.changeName("New Product B");
    
    expect(product.name).toBe("New Product B");
  });

  it("should change price", () => {
    const product = new ProductB("1", "Product B", 100);
    product.changePrice(150);
    
    expect(product.price).toBe(300); // 150 * 2
  });

  it("should allow zero price", () => {
    const product = new ProductB("1", "Free Product B", 0);
    
    expect(product.price).toBe(0); // 0 * 2
  });

  it("should validate after name change", () => {
    const product = new ProductB("1", "Product B", 100);
    
    expect(() => {
      product.changeName("");
    }).toThrowError("Name is required");
  });

  it("should validate after price change", () => {
    const product = new ProductB("1", "Product B", 100);
    
    expect(() => {
      product.changePrice(-1);
    }).toThrowError("Price must be greater than or equal to zero");
  });
});