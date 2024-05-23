import { Box, Button, ButtonGroup, Icon } from "@chakra-ui/react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import PageNumberButton from "./PageNumberButton";

interface Props {
  range: number; // Creates page selectors from 1:range inclusive
  limit: number; // Limit how many page numbers are displayed at one time
  selected: number;
  onSelect: (x: number) => void;
  minimal?: boolean;
}

// Page selector creates 1...range cell boxes that are selectable
const PageSelector = ({
  range,
  limit,
  selected,
  onSelect,
  minimal = true,
}: Props) => {
  if (limit < 5) {
    throw RangeError("Limit must be at minimum 5.");
  }

  const cells: JSX.Element[] = [];

  // Render up to limit cells.
  // Start at first cell (1) or selected cell - 1 (always have at least one cell before selected cell)

  // If range > limit, display limit - 1 numbers

  // Push a left arrow
  cells.push(
    <Button
      isDisabled={selected === 1}
      color="var(--col-secondary)"
      variant="ghost"
      _hover={{ bg: "lightgray" }}
      key="page-left"
      aspectRatio="1/1"
      borderColor="gray.500"
      onClick={() => onSelect(selected - 1)}
      width={minimal ? "auto" : "80px"}
    >
      <Icon as={FaAngleLeft} />
      {minimal ? "" : "Left"}
    </Button>,
  );
  if (range <= limit) {
    for (let i = 1; i <= range; i++) {
      cells.push(
        <PageNumberButton
          selectedValue={selected}
          displayValue={i}
          onSelect={onSelect}
          key={"pageSelect" + i}
        />,
      );
    }
  } else {
    const start = Math.max(1, selected - Math.floor((limit - 2) / 2));
    const end = Math.min(range, selected + Math.floor((limit - 2) / 2));
    console.log("Starting at ", start, " and ending at ", end);
    // Always push a 1
    cells.push(
      <PageNumberButton
        selectedValue={selected}
        displayValue={1}
        onSelect={onSelect}
        key={"pageSelect1"}
      />,
    );
    // Push the rest of range
    for (let i = start; i <= end; i++) {
      if (i === 1 || i === range) continue;
      <PageNumberButton
        selectedValue={selected}
        displayValue={i}
        onSelect={onSelect}
        key={"pageSelect" + i}
      />;
    }
    // Always push the end of the range
    cells.push(
      <PageNumberButton
        selectedValue={selected}
        displayValue={range}
        onSelect={onSelect}
        key={"pageSelect" + range}
      />,
    );
    // Insert ... buttons if necessary
    if (selected - Math.floor((limit - 2) / 2) > 2)
      cells.splice(
        1,
        0,
        <PageNumberButton displayValue={-1} key={"pageSkip1"} />,
      );
    if (selected + Math.floor((limit - 1) / 2) < range - 2)
      cells.splice(
        range - 2,
        0,
        <PageNumberButton displayValue={-2} key={"pageSkip2"} />,
      );
  }
  // Push a right arrow
  cells.push(
    <Button
      isDisabled={selected === range}
      color="var(--col-secondary)"
      variant="ghost"
      _hover={{ bg: "lightgray.500" }}
      key="page-right"
      aspectRatio="1/1"
      borderColor="gray.500"
      onClick={() => onSelect(selected + 1)}
      width={minimal ? "auto" : "80px"}
    >
      {minimal ? "" : "Right"}
      <Icon as={FaAngleRight} />
    </Button>,
  );

  return (
    <Box height="100%">
      <ButtonGroup isAttached>{cells.map((item) => item)}</ButtonGroup>
    </Box>
  );
};

export default PageSelector;
