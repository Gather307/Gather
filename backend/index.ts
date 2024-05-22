import express, { Express, Request, Response, NextFunction } from "express";
import { userEndpoints } from "./routes/userRoutes";
import { groupEndpoints } from "./routes/groupRoutes";
import { basketEndpoints } from "./routes/basketRoutes";
import { itemEndpoints } from "./routes/itemRoutes";
import connectDB from "./connection";
import { loginUser } from "./auth";
import { log } from "console";

const app: Express = express();
app.use(express.json());

// Enable CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
  next();
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
  const result = "Hello world!";
  res.send(result);
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
