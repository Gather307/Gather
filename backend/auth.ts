import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "./models/userSchema.js";
import dotenv from "dotenv";
import { Request, Response } from "express";
import connectDB from "./connection.js";

dotenv.config();

type User = { username: string; hashedPassword: string };
const creds = [User]; // username, hashedPassword

export function authenticateUser(req: Request, res: Response, next: any) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET as jwt.Secret,
      (error, decoded) => {
        if (decoded) {
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      },
    );
  }
}

export const loginUser = async (req: Request, res: Response) => {
  connectDB();
  const { username, password } = req.body; // from form
  let existingUser: IUser | null = null;
  try {
    existingUser = await User.findOne({ username }).orFail();
  } catch (error) {
    console.log("Failed to find user");
    return res.status(401).send("Unauthorized: Failed to find user");
  }
  console.log("Existing user:", existingUser);

  if (existingUser == null) {
    // invalid username
    res.status(401).send("Unauthorized: Not a user");
  } else {
    try {
      console.log("Comparing passwords");
      console.log(password, existingUser.password);
      const matched = await bcrypt.compare(password, existingUser.password);
      console.log("Password matched:", matched);
      if (matched) {
        const token = await generateAccessToken(username);
        console.log("Token generated:", token);
        res.status(200).send({ existingUser, token });
      } else {
        // invalid password
        console.log("Invalid password");
        res.status(401).send("Unauthorized: Invalid password");
      }
    } catch (error) {
      console.log("Failed to authenticate user");
      res.status(401).send("Unauthorized: Failed to authenticate user");
    }
  }
};

function generateAccessToken(username: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET as jwt.Secret,
      { expiresIn: "1d" },
      (error: Error | null, token: string | undefined) => {
        if (error) {
          reject(error);
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error("Token generation failed"));
        }
      },
    );
  });
}

export { generateAccessToken };
