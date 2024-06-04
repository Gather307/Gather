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
    console.log(
      "Error: limit for PageSelector must be at most 5. Supplied: ",
      limit,
    );
    return <Box>error loading page selector.</Box>;
  }

  const cells: JSX.Element[] = []; //Holds a list of elements to render
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
    const borderRange = Math.floor((limit - 2) / 2);
    let start = Math.max(1, selected - borderRange);
    let end = Math.min(range, selected + borderRange);

    if (end <= limit - 1) {
      // Implies that we should just display up to limit numbers
      // (minus one for the end of the range) since we are very early in the list
      end = limit - 1; // Like a "ceil" operation
      if (start != 1) {
        throw RangeError("Misalignment of range occured, lower bound");
      }
    } else if (start >= range - limit + 1) {
      // Inverse of above
      start = range - limit + 2; // Range is inclusive, so add two (if limit is 5 & range 10, this displays 1...7, 8, 9, 10)
      if (end != range) {
        throw RangeError("Misalignment of range occured, upper bound");
      }
    }

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
      cells.push(
        <PageNumberButton
          selectedValue={selected}
          displayValue={i}
          onSelect={onSelect}
          key={"pageSelect" + i}
        />,
      );
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
    if (selected - borderRange > 2) {
      cells.splice(
        2,
        0,
        <PageNumberButton displayValue={-1} key={"pageSkip1"} />,
      );
    }
    if (selected + borderRange < range - 2) {
      cells.splice(
        start === 1 ? end + 1 : limit + 1, // Wild formula but just trust me on this bro
        0,
        <PageNumberButton displayValue={-1} key={"pageSkip2"} />,
      );
    }
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
