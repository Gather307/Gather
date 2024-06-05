import { ObjectId } from "mongoose";

const vite_backend_url = "https://gather-app-307.azurewebsites.net";

// Type definitions for new user, new items, credentials, and basket data
type newUser = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type newItems = {
  name: string;
  toShare: boolean;
  isPrivate: boolean;
  type: string;
  notes: string;
  price: number;
  quantity: number;
  basket: ObjectId[];
};

type credentials = {
  username: string;
  password: string;
};

type basketData = {
  basketName: string;
  description: string;
  members: ObjectId[];
};

// Function to create a new user
export const createUser = async (user: newUser) => {
  return fetch(`${vite_backend_url}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user), // Sending the item data as JSON in the request body
  });
};

// Function to create a new item
export const createNewItem = async (itemData: newItems) => {
  return fetch(`${vite_backend_url}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(itemData),
  });
};

// Function to log in a user
export const loginUser = async (credentials: credentials) => {
  return fetch(`${vite_backend_url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(credentials),
  });
};

// Function to create a new group
export const createNewGroup = async (groupData: any) => {
  return fetch(`${vite_backend_url}/groups/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(groupData),
  });
};

// Function to create a new basket
export const createNewBasket = async (basketData: basketData) => {
  return fetch(`${vite_backend_url}/baskets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(basketData),
  });
};
