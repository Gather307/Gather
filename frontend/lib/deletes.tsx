import { ObjectId } from "mongoose";
import { IBasket } from "../../backend/models/basketSchema";
import { IItem } from "../../backend/models/itemSchema";
import { fetchGroupById } from "./fetches";

const vite_backend_url = "https://gather-app-307.azurewebsites.net";
const token = localStorage.getItem("token");

// Function to delete a group
export const handleDeleteGroup = async (groupId: string) => {
  try {
    const response = await fetch(`${vite_backend_url}/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("group deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the group", error);
  }
};

// Function to delete all baskets and items in a group
export const handleDeleteAllBasketsAndItems = async (groupId: string) => {
  try {
    const data = await fetchGroupById(groupId);
    if (data) {
      const group = await data.json();
      const groupBaskets = group.baskets;
      for (const basketId of groupBaskets) {
        // Delete all items in the basket
        await handleDeleteAllItemsInBasket(basketId);
        // Delete the basket itself
        await handleDeleteBasket(basketId);
      }
    }
    console.log("All baskets and their items deleted successfully");
  } catch (error) {
    console.error(
      "There was an error deleting baskets and items in the group",
      error,
    );
  }
};

// Function to delete an item
export const handleDeleteItem = async (itemId: string) => {
  try {
    const response = await fetch(`${vite_backend_url}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("item deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the item", error);
  }
};

// Function to delete a basket
export const handleDeleteBasket = async (basketId: string) => {
  try {
    const response = await fetch(`${vite_backend_url}/baskets/${basketId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("Basket deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the basket", error);
  }
};

// Function to remove a group from users' group lists
export const handleDeleteGroupFromUsers = async (
  groupId: string,
  userIds: string[],
) => {
  try {
    // Iterate over each userId
    for (const userId of userIds) {
      const response = await fetch(`${vite_backend_url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const user = await response.json();
        const userGroups = user.groups;

        // Remove the group from the user's groups
        const updatedGroups = userGroups.filter((id: string) => id !== groupId);

        // Update the user object
        user.groups = updatedGroups;

        // Send the updated user data back to the server
        const updateResponse = await fetch(
          `${vite_backend_url}/users/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ groups: updatedGroups }),
          },
        );

        if (updateResponse.ok) {
          console.log(`Group removed successfully from user ${userId}`);
        } else {
          console.log(`Failed to update the user ${userId}`);
        }
      } else {
        console.log(`Failed to fetch the user data for user ${userId}`);
      }
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

//single user version of above code so that we can solo delete
export const handleDeleteGroupFromUser = async (
  groupId: string,
  userId: string,
) => {
  try {
    const response = await fetch(`${vite_backend_url}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const user = await response.json();
      const userGroups = user.groups;

      // Remove the group from the user's groups
      const updatedGroups = userGroups.filter((id: string) => id !== groupId);

      // Update the user object
      user.groups = updatedGroups;

      // Send the updated user data back to the server
      const updateResponse = await fetch(
        `${vite_backend_url}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ groups: updatedGroups }),
        },
      );

      if (updateResponse.ok) {
        console.log(`Group removed successfully from user ${userId}`);
      } else {
        console.log(`Failed to update the user ${userId}`);
      }
    } else {
      console.log(`Failed to fetch the user data for user ${userId}`);
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

//now this is reverse version deleting user from group's .members
export const handleDeleteUserFromGroup = async (
  groupId: string,
  userId: string,
) => {
  try {
    const response = await fetch(`${vite_backend_url}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const group = await response.json();
      const groupmembers = group.members;

      // Remove the user from the group's members
      const updatedusers = groupmembers.filter((id: string) => id !== userId);

      // Update the group object
      group.members = updatedusers;

      // Send the updated group data back to the server
      const updateResponse = await fetch(
        `${vite_backend_url}/groups/${groupId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ members: updatedusers }),
        },
      );

      if (updateResponse.ok) {
        console.log(`user removed successfully from group ${groupId}`);
      } else {
        console.log(`Failed to update the group ${groupId}`);
      }
    } else {
      console.log(`Failed to fetch the group data for group ${groupId}`);
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

export const handleRemoveUserFromEachBasket = async (
  groupId: string,
  userId: string,
) => {
  try {
    const response = await fetch(`${vite_backend_url}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const group = await response.json();
      const groupBaskets = group.baskets;
      for (const basketId of groupBaskets) {
        try {
          const response = await fetch(
            `${vite_backend_url}/baskets/${basketId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          if (response.ok) {
            const basket = await response.json();
            const basketmembers = basket.members;
            if (basketmembers.includes(userId)) {
              const updatedmembers = basketmembers.filter(
                (id: string) => id !== userId,
              );
              // Update the basket object
              basket.members = updatedmembers;
              if (basketmembers.length === 1) {
                await handleDeleteBasketFromGroup(groupId, basketId);
                await handleDeleteAllItemsInBasket(basketId);
                await handleDeleteBasket(basketId);
              } else {
                const updateResponse = await fetch(
                  `${vite_backend_url}/baskets/${basketId}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ members: updatedmembers }),
                  },
                );
                if (updateResponse.ok) {
                  console.log(
                    `user removed successfully from basket ${basketId}`,
                  );
                } else {
                  console.log(`Failed to update the basket ${basketId}`);
                }
              }
            }
          } else {
            console.log("Failed to fetch the basket data");
          }
        } catch (error) {
          console.log("an error occured", error);
        }
      }
    } else {
      console.log("Failed to fetch the group data");
    }
  } catch (error) {
    console.log("an error occured", error);
  }
};

// Function to remove a basket from a group
export const handleDeleteBasketFromGroup = async (
  groupId: string,
  basketId: string,
) => {
  try {
    const response = await fetch(`${vite_backend_url}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const group = await response.json();
      const groupBaskets = group.baskets;

      // Remove the basketId from the group's baskets
      const updatedBaskets = groupBaskets.filter(
        (id: string) => id !== basketId,
      );

      // Update the group object
      group.baskets = updatedBaskets;

      // Send the updated group data back to the server
      const updateResponse = await fetch(
        `${vite_backend_url}/groups/${groupId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ baskets: updatedBaskets }),
        },
      );

      if (updateResponse.ok) {
        console.log("Basket removed successfully");
      } else {
        console.log("Failed to update the group");
      }
    } else {
      console.log("Failed to fetch the group data");
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

// Function to delete all items in a basket
export const handleDeleteAllItemsInBasket = async (basketId: string) => {
  try {
    // Fetch all items in the basket
    const response = await fetch(`${vite_backend_url}/baskets/${basketId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching items: ${response.statusText}`);
    }

    const basket = await response.json();
    const items = basket.items;

    // Delete each item in the basket
    for (const itemId of items) {
      await handleDeleteItem(itemId);
    }

    console.log("All items in the basket deleted successfully");
  } catch (error) {
    console.error("There was an error deleting items in the basket", error);
  }
};

// Function to remove a friend from a user
export const removeFriendFromUserByFriendId = async (
  friendId: string,
  userId: string,
) => {
  try {
    const response = await fetch(
      `${vite_backend_url}/users/${userId}/remove-friend`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ friendId: friendId }),
      },
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("Friend removed successfully");
  } catch (error) {
    console.error("There was an error removing the friend", error);
  }
};

// Function to remove an item from a basket and delete the item
export const removeItemFromBasketAndDelete = async (
  baskets: IBasket[],
  item: IItem,
) => {
  try {
    baskets.forEach(async (basket) => {
      if (basket.items.includes(item._id)) {
        const newItems = basket.items.filter((i: ObjectId) => i !== item._id);
        const res = await fetch(`${vite_backend_url}/baskets/${basket._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: newItems }),
        });
        if (res.status === 200) {
          return await fetch(`${vite_backend_url}/items/${item._id}`, {
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
    console.error(
      "There was an error removing the item from the basket",
      error,
    );
  }
};

// Function to delete an item from a basket by basket ID
export const deleteItemWithBasketString = (item: IItem, bid: string = "") => {
  if (!item.basket && bid === "") throw "Missing basket id.";
  fetch(
    `${vite_backend_url}/baskets/${item?.basket ? item.basket : bid}/removeitem`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ item: item._id }),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        fetch(`${vite_backend_url}/items/${item._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          console.log("Response: ", response);
        });
      } else Promise.reject("failed to remove item from basket");
    })
    .catch((error) => {
      console.log(error);
    });
};
