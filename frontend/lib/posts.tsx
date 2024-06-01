import { ObjectId } from "mongoose";

const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;
console.log("Backend URL:", vite_backend_url);

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

export const createUser = async (user: newUser) => {
  return fetch(`${vite_backend_url}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

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

export const loginUser = async (credentials: credentials) => {
  return fetch(`${vite_backend_url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
};

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
