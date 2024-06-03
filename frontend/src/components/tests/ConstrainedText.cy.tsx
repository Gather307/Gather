import ConstrainedText from "../ConstrainedText";

describe("<ConstrainedText />", () => {
  let charLimit = 10;
  let string = "This is the constrained text.";

  it("renders correctly when provided text under limit", () => {
    charLimit = 100;
    cy.mount(<ConstrainedText text={string} charLimit={charLimit} />);
    cy.get("p.chakra-text", {
      timeout: 500,
    }).should("have.text", string.slice(0, charLimit));
  });

  it("renders the correct amount of characters.", () => {
    cy.mount(<ConstrainedText key="C1" text={string} charLimit={charLimit} />);
    cy.get("p.chakra-text").contains(string.slice(0, charLimit), {
      timeout: 500,
    });
  });

  it("correctly postfixes text", () => {
    charLimit = 10;
    cy.mount(
      <ConstrainedText text={string} charLimit={charLimit} postfix="..." />
    );
    cy.get("p.chakra-text", {
      timeout: 500,
    }).should("have.text", string.slice(0, charLimit - 3) + "...");
  });

  it("correctly prefixes text", () => {
    cy.mount(
      <ConstrainedText text={string} charLimit={charLimit} prefix="..." />
    );
    cy.get("p.chakra-text", {
      timeout: 500,
    }).should("have.text", "..." + string.slice(0, charLimit - 3));
  });

  it("can prefix and postfix simultaneously", () => {
    cy.mount(
      <ConstrainedText
        text={string}
        charLimit={charLimit}
        prefix=".,."
        postfix=",.,"
      />
    );
    cy.get("p.chakra-text", {
      timeout: 500,
    }).should("have.text", ".,." + string.slice(0, charLimit - 6) + ",.,");
  });

  it("correctly renders postfix with a postfix longer than char limit", () => {
    cy.mount(
      <ConstrainedText
        text={string}
        charLimit={charLimit}
        postfix="This is a long postfix."
      />
    );
    cy.get("p.chakra-text", {
      timeout: 500,
    }).should("have.text", "This is a long postfix.");
  });

  //Visual test
  it("uses provided styles", () => {
    cy.mount(
      <ConstrainedText
        text={string}
        charLimit={1000}
        style={{
          color: "rgba(255,0,0,1)",
          backgroundColor: "rgb(0,155, 255)",
        }}
      />
    );
  });
});
