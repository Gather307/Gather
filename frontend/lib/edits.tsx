import { ObjectId } from "mongoose";
import { IBasket } from "../../backend/models/basketSchema";
import { IItem } from "../../backend/models/itemSchema";
import { IUser } from "../../backend/models/userSchema";
import { IGroup } from "../../backend/models/groupSchema";
import { fetchBasket } from "./fetches";
import { handleDeleteBasket } from "./deletes";

// const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;
const vite_backend_url = "https://gather-app-307.azurewebsites.net";

// Types for updating data
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
  isPrivate: boolean;
  price: string;
  quantity: string;
};

const token = localStorage.getItem("token");

// Add a group to a user
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

// Edit group details
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

// Edit basket details
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

// Add items to a basket
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

// Edit item details
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

// Move item from one basket to another
export const moveItem = async (
  userBaskets: IBasket[],
  newBasket: IBasket,
  item: IItem,
) => {
  try {
    if (newBasket._id === item.basket) {
      console.log("Item already in basket");
      return;
    }
    console.log(userBaskets, item, newBasket);
    const res = await fetchBasket(String(item.basket));
    if (!res.ok) {
      console.error("Failed to fetch current basket");
      return;
    } else {
      const currentBasket = (await res.json()) as IBasket;
      console.log(currentBasket);
      const newBasketsItems = currentBasket?.items.filter(
        (i) => i !== item._id,
      );
      console.log(newBasketsItems);

      // Remove item from current basket
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

      // Update item with new basket
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

      // Update new basket with the item
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
    }
  } catch (error) {
    console.error("Error moving item:", error);
  }
};

// Edit user details
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

// Add baskets to a group
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

// Add users to a group
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

// Add friends to a user
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

// Remove a user from a group by first removing all of their baskets (that are ONLY associated with them)
export const removeUserFromGroup = async (group: IGroup, user: IUser) => {
  fetch(`${vite_backend_url}/groups/removeuser/${group._id}&${user._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: "",
  })
    .then((res) => {
      if (res.status === 207) {
        return res.json();
      } else if (res.status === 200) {
        console.log("Successfully removed user.");
        return;
      } else Promise.reject(`Request failed: ${res.status} ${res.statusText}`);
    })
    .then((json) => {
      if (!json) return;
      for (let i = 0; i < json.length; i++) {
        handleDeleteBasket(json[i]);
        removeBasketFromGroup(group, json[i]);
      }
      // Remove user from group
    })
    .then(() => {
      // Remove group from user
    })
    .catch((error) => {
      console.log("Error deleting user: ", error);
    });
};

// Remove a basket from a group
export const removeBasketFromGroup = async (group: IGroup, bid: string) => {
  fetch(`${vite_backend_url}/groups/removebasket/${group._id}&${bid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: "",
  }).then((res) => {
    if (res.status === 200) {
      console.log("Successfully removed basket from group.");
    } else {
      Promise.reject("Failed to remove the basket from the group.");
    }
  });
};
