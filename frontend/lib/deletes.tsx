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
