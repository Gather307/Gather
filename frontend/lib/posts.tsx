type newUser = {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

type credentials = {
    username: string;
    password: string;
}

export const createUser = async (user: newUser) => {
    return fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  export const loginUser = async (credentials: credentials) => {
    return fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  };