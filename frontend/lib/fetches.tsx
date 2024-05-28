
export const fetchBasket = (basketId: string) => {
  return fetch(`http://localhost:3001/baskets/${basketId}`);
};

export const fetchItem = (itemId: string) => {
  return fetch(`http://localhost:3001/items/${itemId}`);
};