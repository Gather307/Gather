import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type User = { username: string; hashedPassword: string };
const creds: User[] = [];

function registerUser(req, res) {
  const { username, pwd } = req.body; // from form

  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else if (creds.find((c: { username }) => c.username === username)) {
    res.status(409).send("Username already taken");
  } else {
    try {
      const salt = bcrypt.genSalt(10)
      if (!salt) {
        bcrypt.hash(pwd, salt)
        .then((hashedPassword: string) => {
          generateAccessToken(username).then((token) => {
            console.log("Token:", token);
            res.status(201).send({ token: token });
            creds.push({ username, hashedPassword });
          });
        });
      } else {
        res.status(500).send("Internal server error");
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}

function loginUser(req, res) {
  const { username, pwd } = req.body; // from form
  const retrievedUser = creds.find(
    (c: { username }) => c.username === username
  );

  if (!retrievedUser) {
    // invalid username
    res.status(401).send("Unauthorized");
  } else {
    bcrypt
      .compare(pwd, (retrievedUser as { username, hashedPassword }).hashedPassword)
      .then((matched) => {
        if (matched) {
          generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send("Unauthorized");
        }
      })
      .catch(() => {
        res.status(401).send("Unauthorized");
      });
  }
}


function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (error, decoded) => {
        if (decoded) {
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      }
    );
  }
}

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export { registerUser, loginUser, authenticateUser };