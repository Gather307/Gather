import { Express } from "express";
const express = require("express"); // 1. includes Express
const app: Express = express(); // 2. initializes Express
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!')
});

app.listen(3001);