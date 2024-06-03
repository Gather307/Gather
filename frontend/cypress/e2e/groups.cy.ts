describe("retrieve remote groups", () => {
  it("retrieves", () => {
    const vite_backend_url = Cypress.env("VITE_BACKEND_URL");
    cy.request(`${vite_backend_url}/groups`).then((res) => {
      console.log(res);
    });
  });
});
