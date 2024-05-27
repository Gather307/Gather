import { ChakraProvider } from "@chakra-ui/react";
import SkeletonGroup from "../SkeletonGroup";

describe("<SkeletonGroup/>", () => {
  it("Renders with specific, equal w&h", () => {
    cy.mount(
      <ChakraProvider>
        <SkeletonGroup width="400px" height="400px" />
      </ChakraProvider>
    );
  });

  it("Renders with specific w>h ", () => {
    cy.mount(
      <ChakraProvider>
        <SkeletonGroup width="400px" height="200px" />
      </ChakraProvider>
    );
  });

  it("Renders with specific w<h", () => {
    cy.mount(
      <ChakraProvider>
        <SkeletonGroup width="200px" height="400px" />
      </ChakraProvider>
    );
  });

  it("properly shrinks children for small w&h", () => {
    cy.mount(
      <ChakraProvider>
        <SkeletonGroup width="400px" height="400px" />
      </ChakraProvider>
    );
  });

  it("correctly computes corners", () => {
    cy.mount(
      <ChakraProvider>
        <SkeletonGroup
          width="400px"
          height="400px"
          corners={[true, true, true, true]}
        />
      </ChakraProvider>
    );
  });
});
