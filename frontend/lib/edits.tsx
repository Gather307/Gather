import { ObjectId } from "mongoose";
import { IBasket } from "../../backend/models/basketSchema";
import { IItem } from "../../backend/models/itemSchema";
import { IUser } from "../../backend/models/userSchema";
import { IGroup } from "../../backend/models/groupSchema";

// const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;
const vite_backend_url = "https://gather-app-307.azurewebsites.net";
type updatedGroup = {
  groupName: string;
  description: string;
  privateGroup: string;
};

type updatedBasket = {
  basketName: string;
  description: string;
};

type updatedItem = {
  name: string;
  notes: string;
  toShare: string;
  isPrivate: string;
  price: string;
  quantity: string;
};

const token = localStorage.getItem("token");

export const addGroupToUser = async (user: IUser, groups: string[]) => {
  return fetch(`${vite_backend_url}/users/${user._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ groups: groups }),
  });
};

export const editGroup = async (groupId: string, groupData: updatedGroup) => {
  return fetch(`${vite_backend_url}/groups/${groupId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(groupData),
  });
};

export const editBasket = async (
  basketId: string,
  basketData: updatedBasket,
) => {
  return fetch(`${vite_backend_url}/baskets/${basketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(basketData),
  });
};

export const addItemToBasket = async (
  basketId: ObjectId,
  basketItems: ObjectId[],
) => {
  return fetch(`${vite_backend_url}/baskets/${basketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ items: basketItems }),
  });
};

export const editItem = async (itemId: string, itemData: updatedItem) => {
  return fetch(`${vite_backend_url}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(itemData),
  });
};

export const moveItem = async (
  userBaskets: IBasket[],
  newBasket: IBasket,
  item: IItem,
) => {
  try {
    console.log(userBaskets);
    const itemBasket = userBaskets.find((b) => b._id === item.basket);
    console.log(itemBasket);
    const newBasketsItems = itemBasket?.items.filter((i) => i !== item._id);
    const removeItemFromBasket = await fetch(
      `${vite_backend_url}/baskets/${item.basket}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newBasketsItems,
        }),
      },
    );
    if (removeItemFromBasket.ok) {
      console.log("Item removed from basket successfully");
    } else {
      console.error("Failed to remove item");
    }
    const updatedItem = await fetch(`${vite_backend_url}/items/${item._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ basket: newBasket._id }),
    });
    if (updatedItem.ok) {
      console.log("Item added to basket successfully");
    } else {
      console.error("Failed to update item");
    }
    const updatedBasket = await fetch(
      `${vite_backend_url}/baskets/${newBasket._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [...newBasket.items, item._id] }),
      },
    );
    if (updatedBasket.ok) {
      console.log("Item added to basket successfully");
    } else {
      console.error("Failed to update basket");
    }
  } catch (error) {
    console.error("Error moving item:", error);
  }
};

export const editUser = async (
  userId: string,
  userData: { firstName: string; lastName: string },
) => {
  return fetch(`${vite_backend_url}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(userData),
  });
};

export const addBasketToGroup = async (group: IGroup, baskets: ObjectId[]) => {
  return fetch(`${vite_backend_url}/groups/${group._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ baskets: baskets }),
  });
};

export const addUserToGroup = async (group: IGroup, users: ObjectId[]) => {
  return fetch(`${vite_backend_url}/groups/${group._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ members: users }),
  });
};

export const addFriendToUser = async (
  user: IUser,
  updatedFriends: ObjectId[],
) => {
  return fetch(`${vite_backend_url}/users/${user._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ friends: updatedFriends }),
  });
};
