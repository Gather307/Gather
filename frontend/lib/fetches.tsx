
export const fetchBasket = async (basketId: string) => {
  return fetch(`http://localhost:3001/baskets/${basketId}`);
};

export const fetchItem = async (itemId: string) => {
  return fetch(`http://localhost:3001/items/${itemId}`);
};

export const fetchGroup = async (groupId: string) => {
  return fetch(`http://localhost:3001/groups/${groupId}`);
}