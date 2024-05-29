import { IUser } from "backend/models/userSchema";
import { IGroup } from "backend/models/groupSchema";

export const fetchBasket = async (basketId: string) => {
  return fetch(`http://localhost:3001/baskets/${basketId}`);
};

export const fetchItem = async (itemId: string) => {
  return fetch(`http://localhost:3001/items/${itemId}`);
};

export const fetchGroup = async (groupId: string) => {
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