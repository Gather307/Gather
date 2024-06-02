import { IUser } from "../../backend/models/userSchema";
import { IGroup } from "../../backend/models/groupSchema";
import { IBasket } from "../../backend/models/basketSchema";
import { ObjectId } from "mongoose";
import { addUserToGroup, addGroupToUser } from "./edits";

// const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;
const vite_backend_url = "https://gather-app-307.azurewebsites.net";

export const fetchBasket = async (basketId: string) => {
  return fetch(`${vite_backend_url}/baskets/${basketId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchItem = async (itemId: string) => {
  return fetch(`${vite_backend_url}/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchGroupById = async (groupId: string) => {
  try {
    const res = await fetch(`${vite_backend_url}/groups/${groupId}`, { 
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
    );
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Failed to fetch group: ${res.statusText}`);
    }
  } catch (err) {
    return null;
  }
};

export const fetchGroup = async (groupId: string) => {
  return fetch(`${vite_backend_url}/groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchUser = async (userId: ObjectId) => {
  return fetch(`${vite_backend_url}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchUserWithString = async (userId: string) => {
  return fetch(`${vite_backend_url}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  );
};

export const fetchUserGroupsByUser = async (user: IUser) => {
  const groupPromises = user.groups.map(async (group: ObjectId) => {
    const res = await fetch(`${vite_backend_url}/groups/${group}`, {
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

  const tempGroupList: IGroup[] = await Promise.all(groupPromises);
  return tempGroupList;
};

export const fetchUserFriendsByUser = async (user: IUser) => {
  const friendPromises = user.friends.map(async (friend: ObjectId) => {
    const res = await fetch(`${vite_backend_url}/users/${friend}`, {
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

  const tempFriendList: IUser[] = await Promise.all(friendPromises);
  return tempFriendList;
};

export const addFriendToGroup = async (friendId: ObjectId, groupId: string) => {
  try {
    const group = await fetchGroupById(groupId);
    const res = await fetchUser(friendId);

    let friend;
    if (res.ok && group) {
      friend = await res.json();
      if (!group.members.includes(friendId)) {
        group.members.push(friendId);
        console.log("Pushed friend ID to group's member list");
        const updatedRes1 = await addUserToGroup(group, group.members);
        if (updatedRes1.ok) {
          console.log("Friend added to group's member list successfully");
        } else {
          console.error("Failed to update group");
        }
      }
      if (!friend.groups.includes(groupId)) {
        friend.groups.push(groupId);
        console.log("Pushed to list");

        const updatedRes = await addGroupToUser(friend, friend.groups);
        if (updatedRes.ok) {
          console.log("Friend added to group successfully");
          window.location.reload();
        } else {
          console.error("Failed to update user");
        }
      } else {
        console.log("Friend is already in group");
      }
    } else {
      console.log("User not Found", res.status);
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
  return [];
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
  console.log(vite_backend_url);
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
