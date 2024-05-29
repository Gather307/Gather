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

export const editGroup = async (groupId: string, groupData: updatedGroup) => {
  return fetch(`http://localhost:3001/groups/${groupId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });
};

export const editBasket = async (basketId: string, basketData: updatedBasket) => {
  return fetch(
    `http://localhost:3001/baskets/${basketId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(basketData),
    },
  );
};

export const editItem = async (itemId: string, itemData: updatedItem) => {
  return fetch(`http://localhost:3001/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });
};