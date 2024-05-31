import { IUser } from "../../backend/models/userSchema";
import { IGroup } from "../../backend/models/groupSchema";
import { IBasket } from "../../backend/models/basketSchema";
import { ObjectId } from "mongoose";

const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;

export const fetchBasket = async (basketId: string) => {
<<<<<<< Updated upstream
  return fetch(`${vite_backend_url}/baskets/${basketId}`);
};

export const fetchItem = async (itemId: string) => {
  return fetch(`${vite_backend_url}/items/${itemId}`);
=======
  return fetch(`http://localhost:3001/baskets/${basketId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchItem = async (itemId: string) => {
  return fetch(`http://localhost:3001/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
>>>>>>> Stashed changes
};

export const fetchGroupById = async (groupId: string) => {
  try {
<<<<<<< Updated upstream
    const res = await fetch(`${vite_backend_url}/groups/${groupId}`);
=======
    const res = await fetch(`http://localhost:3001/groups/${groupId}`, { 
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
>>>>>>> Stashed changes
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Failed to fetch group: ${res.statusText}`);
    }
  } catch (err) {
    return null;
  }
};

export const fetchUser = async (userId: ObjectId) => {
<<<<<<< Updated upstream
  return fetch(`${vite_backend_url}/users/${userId}`);
};

export const fetchUserWithString = async (userId: string) => {
  return fetch(`${vite_backend_url}/users/${userId}`);
=======
  return fetch(`http://localhost:3001/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchUserWithString = async (userId: string) => {
  return fetch(`http://localhost:3001/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
>>>>>>> Stashed changes
};

export const fetchUserGroupsByUser = async (user: IUser) => {
  const groupPromises = user.groups.map(async (group: ObjectId) => {
<<<<<<< Updated upstream
    const res = await fetch(`${vite_backend_url}/groups/${group}`);
=======
    const res = await fetch(`http://localhost:3001/groups/${group}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
>>>>>>> Stashed changes
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  });

  const tempGroupList: IGroup[] = await Promise.all(groupPromises);
  return tempGroupList;
};

export const fetchUserFriendsByUser = async (user: IUser) => {
  const friendPromises = user.friends.map(async (friend: ObjectId) => {
<<<<<<< Updated upstream
    const res = await fetch(`${vite_backend_url}/users/${friend}`);
=======
    const res = await fetch(`http://localhost:3001/users/${friend}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
>>>>>>> Stashed changes
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  });

  const tempFriendList: IUser[] = await Promise.all(friendPromises);
  return tempFriendList;
};

export const addFriendToGroup = async (friendId: string, groupId: string) => {
  try {
<<<<<<< Updated upstream
    const res = await fetch(`${vite_backend_url}/users/${friendId}`);
=======
    const res = await fetch(`http://localhost:3001/users/${friendId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
>>>>>>> Stashed changes
    let friend;

    if (res.ok) {
      friend = await res.json();
      if (!friend.groups.includes(groupId)) {
        friend.groups.push(groupId);
        console.log("Pushed to list");

        const updatedRes = await fetch(
          `${vite_backend_url}/users/${friendId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ groups: friend.groups }),
          },
        );
        if (updatedRes.ok) {
          console.log("Friend added to group successfully");
        } else {
          console.error("Failed to update user");
        }
      } else {
        console.log("Friend is already in group");
      }
    } else {
      console.log("Group not Found");
    }
  } catch (error) {
    console.error("Error adding friend:", error);
  }
};

export const fetchGroupBaskets = async (group: IGroup) => {
  const basketPromises = group.baskets.map(async (basket) => {
    const res = await fetch(`${vite_backend_url}/baskets/${basket}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.log("error");
    }
  });

  const tempBaskets = (await Promise.all(basketPromises)) as IBasket[];
  return tempBaskets;
};

export const fetchBasketItems = async (basket: IBasket) => {
  if (basket.items.length === 0) {
    return [];
  }
  const itemPromises = basket.items.map(async (item) => {
    const res = await fetch(`${vite_backend_url}/items/${item}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  });

  const tempItems = await Promise.all(itemPromises);
  return tempItems;
};

export const fetchUserBaskets = async (userId: string) => {
  const res = await fetch(`${vite_backend_url}/baskets`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
  if (res.status === 200) {
    const allBaskets = await res.json();
    const userBaskets = [] as IBasket[];
    for (const basket of allBaskets) {
      if (basket.members.includes(userId)) {
        userBaskets.push(basket);
      }
    }
    return userBaskets;
  }
};

export const fetchGroups = async (userGroups: ObjectId[]) => {
  const groupPromises = userGroups.map(async (group) => {
    const res = await fetch(`${vite_backend_url}/groups/${group}`,  {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  });

  const tempGroupList = await Promise.all(groupPromises);
  return tempGroupList.filter((group) => group !== undefined);
};

export const fetchMembers = async (memberIds: ObjectId[]) => {
  try {
    const fetchedMembers = await Promise.all(
      memberIds.map(async (memberId) => {
        const res = await fetch(`${vite_backend_url}/users/${memberId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Failed to fetch user: ${res.statusText}`);
        }
      }),
    );
    return fetchedMembers as IUser[];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const res = await fetch(`${vite_backend_url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(credentials),
  });
  return res;
};
