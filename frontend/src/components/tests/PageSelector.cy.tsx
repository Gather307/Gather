import PageSelector from "../PageSelector";

describe("<PageSelector/>", () => {
  it("loads a full range when range==limit", () => {
    cy.mount(
      <PageSelector range={5} limit={5} selected={3} onSelect={() => {}} />
    );
  });

  it("loads a full range when range < limit", () => {
    cy.mount(
      <PageSelector range={3} limit={5} selected={2} onSelect={() => {}} />
    );
  });

  it("rejects a limit < 5", () => {
    cy.mount(
      <PageSelector range={5} limit={3} selected={3} onSelect={() => {}} />
    );
    cy.get(".css-0").should("have.text", "error loading page selector.");
  });

  it("renders only up to limit cells", () => {
    cy.mount(
      <PageSelector range={10} limit={5} selected={5} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group")
      .children(":visible", { timeout: 500 })
      .should("have.length", 9);

    cy.get(".chakra-button__group > :nth-child(2)").should("have.text", "1");
    cy.get(".chakra-button__group > :nth-child(3)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(4)").should("have.text", "4");
    cy.get(".chakra-button__group > :nth-child(5)").should("have.text", "5");
    cy.get(".chakra-button__group > :nth-child(6)").should("have.text", "6");
    cy.get(".chakra-button__group > :nth-child(7)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(8)").should("have.text", "10");
  });

  it("renders only right ... box when low selected value", () => {
    cy.mount(
      <PageSelector range={10} limit={5} selected={1} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group")
      .children(":visible", { timeout: 500 })
      .should("have.length", 8);

    cy.get(".chakra-button__group > :nth-child(2)").should("have.text", "1");
    cy.get(".chakra-button__group > :nth-child(3)").should("have.text", "2");
    cy.get(".chakra-button__group > :nth-child(4)").should("have.text", "3");
    cy.get(".chakra-button__group > :nth-child(5)").should("have.text", "4");
    cy.get(".chakra-button__group > :nth-child(6)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(7)").should("have.text", "10");
  });

  it("renders only left ... box when high selected values", () => {
    cy.mount(
      <PageSelector range={10} limit={5} selected={9} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group")
      .children(":visible", { timeout: 500 })
      .should("have.length", 8);

    cy.get(".chakra-button__group > :nth-child(2)").should("have.text", "1");
    cy.get(".chakra-button__group > :nth-child(3)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(4)").should("have.text", "7");
    cy.get(".chakra-button__group > :nth-child(5)").should("have.text", "8");
    cy.get(".chakra-button__group > :nth-child(6)").should("have.text", "9");
    cy.get(".chakra-button__group > :nth-child(7)").should("have.text", "10");
  });

  it("has more center values", () => {
    cy.log("with high limits, and not more outer values");
    cy.mount(
      <PageSelector range={10} limit={7} selected={5} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group")
      .children(":visible", { timeout: 500 })
      .should("have.length", 11);

    cy.get(".chakra-button__group > :nth-child(2)").should("have.text", "1");
    cy.get(".chakra-button__group > :nth-child(3)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(4)").should("have.text", "3");
    cy.get(".chakra-button__group > :nth-child(5)").should("have.text", "4");
    cy.get(".chakra-button__group > :nth-child(6)").should("have.text", "5");
    cy.get(".chakra-button__group > :nth-child(7)").should("have.text", "6");
    cy.get(".chakra-button__group > :nth-child(8)").should("have.text", "7");
    cy.get(".chakra-button__group > :nth-child(9)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(10)").should("have.text", "10");
  });

  it("properly renders page values for large ranges", () => {
    cy.mount(
      <PageSelector range={100} limit={5} selected={84} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group")
      .children(":visible", { timeout: 500 })
      .should("have.length", 9);

    cy.get(".chakra-button__group > :nth-child(2)").should("have.text", "1");
    cy.get(".chakra-button__group > :nth-child(3)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(4)").should("have.text", "83");
    cy.get(".chakra-button__group > :nth-child(5)").should("have.text", "84");
    cy.get(".chakra-button__group > :nth-child(6)").should("have.text", "85");
    cy.get(".chakra-button__group > :nth-child(7)").should("have.text", "...");
    cy.get(".chakra-button__group > :nth-child(8)").should("have.text", "100");
  });

  it("renders maximalSelector correctly", () => {
    cy.mount(
      <PageSelector
        range={10}
        limit={5}
        selected={5}
        onSelect={() => {}}
        minimal={false}
      />
    );
    cy.get(".chakra-button__group")
      .children(":visible", { timeout: 500 })
      .should("have.length", 9);

    cy.get(".chakra-button__group > :nth-child(1)").should("have.text", "Left");
    cy.get(".chakra-button__group > :nth-child(9)").should(
      "have.text",
      "Right"
    );
  });

  it("disables left button on select p1", () => {
    cy.mount(
      <PageSelector range={10} limit={5} selected={1} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group > :nth-child(1)").should("be.disabled");
  });

  it("disables left button on select final page", () => {
    cy.mount(
      <PageSelector range={10} limit={5} selected={10} onSelect={() => {}} />
    );
    cy.get(".chakra-button__group > :nth-child(8)").should("be.disabled");
  });
});
