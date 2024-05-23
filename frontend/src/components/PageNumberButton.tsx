import { Button } from "@chakra-ui/react";

interface Props {
  displayValue: number; // Pass <0 for ...
  selectedValue?: number;
  onSelect?: (x: number) => void;
}

const PageNumberButton = ({
  displayValue,
  selectedValue = -1,
  onSelect = () => console.log("Selected an unselectable button"),
}: Props) => {
  return (
    <Button
      isDisabled={displayValue < 0}
      variant="ghost"
      fontWeight={selectedValue === displayValue ? "900" : "300"}
      color={
        selectedValue === displayValue
          ? "var(--col-dark)"
          : "var(--col-secondary)"
      }
      onClick={() => onSelect(displayValue)}
      _hover={{ bg: "lightgray" }}
      borderColor="gray.500"
      borderStyle="solid none solid none"
    >
      {displayValue === -1 ? "..." : displayValue}
    </Button>
  );
};

export default PageNumberButton;
