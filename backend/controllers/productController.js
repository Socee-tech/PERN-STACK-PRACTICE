import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;
    console.log("Products fetched successfully:", products);
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    console.error("Error fetching products function:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
            SELECT * FROM products WHERE id = ${id}
        `;
    if (product?.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log("Product fetched successfully:", product[0]);
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product[0],
    });
  } catch (error) {
    console.error("Error fetching product function:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;

  if (!name || !image || !price) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await sql`
        INSERT INTO products (name, image, price) VALUES
        (${name}, ${image}, ${price})
        RETURNING *
    `;
    console.log("Product created successfully:", newProduct);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct[0],
    });
  } catch (error) {
    console.error("Error creating product function:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;

  try {
    const updatedProduct = await sql`
            UPDATE products
            SET name = ${name}, image = ${image}, price = ${price}
            WHERE id = ${id}
            RETURNING *
        `;
    if (updatedProduct?.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log("Product updated successfully:", updatedProduct[0]);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct[0],
    });
  } catch (error) {
    console.error("Error updating product function:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;

    if (deletedProduct?.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Product deleted successfully:", deletedProduct[0]);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct[0],
    });
  } catch (error) {
    console.error("Error deleting product function:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};