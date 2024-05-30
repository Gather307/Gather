import { IUser } from "backend/models/userSchema";
import { IGroup } from "backend/models/groupSchema";
import { IBasket } from "backend/models/basketSchema";

export const fetchBasket = async (basketId: string) => {
  return fetch(`http://localhost:3001/baskets/${basketId}`);
};

export const fetchItem = async (itemId: string) => {
  return fetch(`http://localhost:3001/items/${itemId}`);
};

export const fetchGroupById = async (groupId: string) => {
  return fetch(`http://localhost:3001/groups/${groupId}`);
}

export const fetchUser = async (userId: string) => {
  return fetch(`http://localhost:3001/users/${userId}`);
}

export const fetchUserGroupsByUser = async (user: IUser) => {
  const groupPromises = user.groups.map(
    async (group: any) => {
      const groupString = group.toString();
      const res = await fetch(`http://localhost:3001/groups/${groupString}`);
      if (res.status === 200) {
        const data = await res.json();
        return data;
      }
    },
  );

  const tempGroupList: IGroup[] = await Promise.all(groupPromises);
  return tempGroupList;
}

export const fetchUserFriendsByUser = async (user: IUser) => {
  const friendPromises = user.friends.map(
    async (friend: any) => {
      const friendString = friend.toString();
      const res = await fetch(`http://localhost:3001/users/${friendString}`);
      if (res.status === 200) {
        const data = await res.json();
        return data;
      }
    },
  );

  const tempFriendList: IUser[] = await Promise.all(friendPromises);
  return tempFriendList;
}

export const addFriendToGroup = async (friendId: string, groupId: string) => {
  try {
    const res = await fetch(`http://localhost:3001/users/${friendId}`);
    let friend;

    if (res.ok) {
      friend = await res.json();
      if (!friend.groups.includes(groupId)) {
        friend.groups.push(groupId);
        console.log("Pushed to list");

        const updatedRes = await fetch(
          `http://localhost:3001/users/${friendId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
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
    const res = await fetch(`http://localhost:3001/baskets/${basket}`);
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
    const res = await fetch(`http://localhost:3001/items/${item}`);
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  });

  const tempItems = await Promise.all(itemPromises);
  return tempItems;
};

export const fetchUserBaskets = async (userId: string) => {
  const res = await fetch("http://localhost:3001/baskets");
  if (res.status === 200) {
    const allBaskets = await res.json();
    const userBaskets = [] as IBasket[]
    for (const basket of allBaskets) {
      if (basket.members.includes(userId)) {
        userBaskets.push(basket);
      }
    }
    return userBaskets;
  }
};

export const fetchGroups = async (userGroups: string[]) => {
  const groupPromises = userGroups.map(async (group) => {
    const res = await fetch(`http://localhost:3001/groups/${group}`);
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  });

  const tempGroupList = await Promise.all(groupPromises);
  return tempGroupList.filter(group => group !== undefined);
};

export const fetchMembers = async (memberIds: string[]) => {
  try {
    const fetchedMembers = await Promise.all(
      memberIds.map(async (memberId) => {
        const res = await fetch(`http://localhost:3001/users/${memberId}`);
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
  }
};


export const loginUser = async (credentials: { username: string, password: string }) => {
  const res = await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return res;
};