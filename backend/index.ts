import express, { Express, Request, Response, NextFunction } from "express";
import { userEndpoints } from "./routes/userRoutes";
import { groupEndpoints } from "./routes/groupRoutes";
import { basketEndpoints } from "./routes/basketRoutes";
import { itemEndpoints } from "./routes/itemRoutes";
import { loginUser } from "./auth";
import jwt from "jsonwebtoken";

const app: Express = express();
app.use(express.json());

// Enable CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, OPTIONS, DELETE, PUT",
  );
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).end(); // Respond with 204 No Content
  } else {
    next(); // Pass to the next middleware or route handler
  }
});

// Testing middleware
function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  next();
}
app.use(loggerMiddleware);

// Routes
app.post("/login", loginUser as any);
app.use("/users", userEndpoints);
app.use("/groups", groupEndpoints);
app.use("/baskets", basketEndpoints);
app.use("/items", itemEndpoints);

app.get("/", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as jwt.Secret,
      (error, decoded) => {
        if (decoded) {
          console.log({ username: (decoded as any).username });
          res.status(200).send({ username: (decoded as any).username });
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      },
    );
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
