import { ObjectId } from "mongoose";

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
  return fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

export const createNewItem = async (itemData: newItems) => {
  return fetch("http://localhost:3001/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(itemData),
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

export const createNewGroup = async (groupData: any) => {
  return fetch("http://localhost:3001/groups/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(groupData),
  });
};

export const createNewBasket = async (basketData: basketData) => {
  return fetch("http://localhost:3001/baskets/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(basketData),
  });
}