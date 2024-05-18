import React from "react";

interface Props {
  range: number; // Creates page selectors from 1:range inclusive
  limit: number; // Limit how many page numbers are displayed at one time
  selected: number;
  onSelect: () => void;
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
  return (
    <div>
      {minimal ? "Minimal page" : "Page"} selector with {range} pages. Current
      page: {selected}. (unimplemented)
    </div>
  );
};

export default PageSelector;
