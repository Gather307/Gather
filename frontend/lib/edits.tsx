type updatedGroup = {
  groupName: string;
  description: string;
  privateGroup: string;
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
