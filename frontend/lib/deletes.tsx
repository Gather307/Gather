import { IBasket } from "backend/models/basketSchema";
import { IItem } from "backend/models/itemSchema";
const token = localStorage.getItem("token");

export const handleDeleteGroup = async (groupId: string) => {
  try {
    const response = await fetch(`http://localhost:3001/groups/${groupId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("group deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the group", error);
  }
};

export const handleDeleteBasket = async (basketId: string) => {
  try {
    const response = await fetch(`http://localhost:3001/baskets/${basketId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("Basket deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the basket", error);
  }
};

export const removeFriendFromUserByFriendId = async (friendId: string, userId: string) => {
  try {
    const response = await fetch(`http://localhost:3001/users/${userId}/remove-friend`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendId: friendId }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("Friend removed successfully");
  } catch (error) {
    console.error("There was an error removing the friend", error);
  }
}

export const removeItemFromBasketAndDelete = async ( baskets: IBasket[], item: IItem) => {
  try {
    baskets.forEach(async (basket) => {
      if (basket.items.includes(item._id)) {
        const newItems = basket.items.filter((i) => i !== item._id);
        const res = await fetch(`http://localhost:3001/baskets/${basket._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: newItems }),
        });
        if (res.status === 200) {
          return await fetch(`http://localhost:3001/items/${item._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }); 
        }
        
      }
    });
  } catch (error) {
    console.error("There was an error removing the item from the basket", error);
  }
}