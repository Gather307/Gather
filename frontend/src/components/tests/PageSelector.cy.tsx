import PageSelector from "../PageSelector";

describe("<PageSelector/>", () => {
  it("freaking loads", () => {
    cy.mount(
      <PageSelector
        range={5}
        limit={5}
        selected={3}
        onSelect={() => {
          console.log("Printin");
        }}
      />
    );
  });
});
