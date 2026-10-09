import express from "express";
import helmet, { contentSecurityPolicy } from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcject.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve(); // Get the current directory path

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false })); //helmet is a security middleware that helps you secure your application by setting various HTTP headers
app.use(morgan("dev")); //morgan logs the requests

// apply arc-jet rate limiting and bot protection middleware to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, //specifies that each request consumes one token
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          success: false,
          message: "Access denied. Bot traffic is not allowed.",
        });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    //check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed(),
      )
    ) {
      res
        .status(403)
        .json({ error: "Forbidden. Spoofed bot traffic is not allowed." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in ArcJet middleware:", error);
    next(error); // Pass the error to the next middleware (error handler)
  }
});

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend build directory
  // SERVE OUR REACT APPLICATION
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

async function initDB() {
  try {
    await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
