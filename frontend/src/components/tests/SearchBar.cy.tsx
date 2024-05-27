import { ChakraProvider } from "@chakra-ui/react";
import SearchBar from "../SearchBar";

describe("<SearchBar/>", () => {
  //This is the intended behavior, since this is a filtering search bar, not one that retrieves data from an endpoint
  it("Submits the search function after every keypress", () => {
    const testdata = "This is input.";
    cy.mount(
      <ChakraProvider>
        <SearchBar placeholder="Search" onSearch={(inp) => console.log(inp)} />
      </ChakraProvider>
    );
    cy.get(".chakra-input").type(testdata);
  });

  //Visual test
  it("uses provided styles", () => {
    cy.mount(
      <ChakraProvider>
        <SearchBar
          placeholder="Hello."
          onSearch={(inp) => console.log(inp)}
          style={{
            color: "rgba(255,0,0,1)",
          }}
        />
      </ChakraProvider>
    );
  });

  it("Submits the search function only on icon", () => {
    const testdata = "This is input.";
    cy.mount(
      <ChakraProvider>
        <SearchBar
          placeholder="Search"
          onSearch={(inp) => console.log(inp)}
          searchAfterEvery={false}
        />
      </ChakraProvider>
    );
    cy.get(".chakra-input").type(testdata);
    cy.get(".chakra-input__right-element").click();
  });

  it("correctly adjusts width", () => {
    cy.mount(
      <ChakraProvider>
        <SearchBar
          placeholder="Search"
          onSearch={(inp) => console.log(inp)}
          searchAfterEvery={false}
          width="50%"
        />
      </ChakraProvider>
    );
  });
});
