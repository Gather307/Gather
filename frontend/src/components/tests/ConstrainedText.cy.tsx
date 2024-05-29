import ConstrainedText from "../ConstrainedText";

describe("<ConstrainedText />", () => {
  it("renders", () => {
    cy.mount(
      <ConstrainedText text="This is the constrained text." charLimit={10} />,
    );
  });
});
