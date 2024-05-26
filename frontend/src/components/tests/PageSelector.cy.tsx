import PageSelector from "../PageSelector";

describe("<PageSelector/>", () => {
  it("freaking loads", () => {
    let selected = 1;

    cy.mount(
      <PageSelector
        range={5}
        limit={5}
        selected={3}
        onSelect={(newval) => {
          console.log("Printin");
          selected = newval;
        }}
      />
    );
  });
});
