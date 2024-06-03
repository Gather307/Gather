/// <reference types="cypress" />

describe("user-follow-happypath", () => {
  beforeEach(() => {
    cy.viewport(1440, 960);
  });
  it("is welcomed to the home page!", () => {
    this.skip();
    cy.visit("http://localhost:5173/");
    cy.get('[style="text-align: center;"] > .chakra-button', {})
      .wait(100)
      .click()
      .wait(3000);
    cy.get('[style="text-align: center;"] > img').then(($homeImage) => {
      if ($homeImage.is(":visible")) {
        expect(1).to.equal(1);
      }
    });

    cy.get(".css-1qw75wv").click();
    cy.get(".css-1urha0v > .chakra-text", { timeout: 500 }).should(
      "have.text",
      "Create New Account"
    ); // Implies that we reached the sign up page successfully
  });

  it("can sign up as a new user", () => {
    this.skip();
    cy.intercept("/users").as("token");
    cy.visit("http://localhost:5173/signup");
    cy.get(".css-1urha0v > .chakra-text", { timeout: 500 }).should(
      "have.text",
      "Create New Account"
    ); // Confirm on sign in page

    // fill fields
    cy.get("#firstName").type("Cid", { delay: 50 });
    cy.get("#lastName").type("Kagenou", { delay: 10 });
    cy.get("#email").type("eminence@gmail.com", { delay: 10 });
    cy.get("#username").type("shadowwizardmoneygangleader", { delay: 25 });
    cy.get("#password").type("eminence", { delay: 50 });
    cy.get("#confirmPassword").type("eminence", { delay: 50 });
    cy.get(".css-1d3g696").click();
    cy.wait("@token").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(400); // Since the user already exists, the server should return error when trying to create
    });
  });

  it("can login", () => {
    cy.visit("http://localhost:5173/login");
    cy.get(".chakra-stack > .chakra-text", { timeout: 500 }).should(
      "have.text",
      "Login"
    );
    cy.get("#username").type("shadowwizardmoneygangleader", { delay: 25 });
    cy.get("#password").type("eminence", { delay: 50 });
    cy.get(".css-1d3g696").click();

    cy.visit("http://localhost:5173/groups");
  });

  //   it("can visit groups after being logged in", () => {
  //     cy.wait(1000);
  //   });
});
