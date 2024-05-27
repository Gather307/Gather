describe("retrieve remote groups", () => {
  it("retrieves", () => {
    cy.request("http://localhost:3001/groups").then((res) => {
      console.log(res);
    });
  });
});
