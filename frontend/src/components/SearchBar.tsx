import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { CSSProperties, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";

interface Props {
  onSearch: (searchText: string) => void;
  placeholder: string;
  searchAfterEvery?: boolean;
  style?: CSSProperties;
  width?: string;
}

const SearchBar = ({
  onSearch,
  placeholder,
  searchAfterEvery = true,
  width = "auto",
  style = {},
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  return (
    <InputGroup width={width} style={style}>
      <Input
        ref={ref}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (searchAfterEvery) onSearch(e.target.value);
        }}
        placeholder={placeholder}
        _placeholder={{
          fontStyle: "italic",
          letterSpacing: "2px",
          fontSize: "0.85rem",
          color: "var(--col-dark)",
        }}
        variant="flushed"
        minWidth={width}
        padding="5px 15px"
        display="flex"
        color="var(--col-dark)"
        borderColor="var(--col-secondary)"
        focusBorderColor="var(--col-secondary)"
      />
      <InputRightElement>
        <Icon
          as={IoSearch}
          color="var(--col-accent)"
          onClick={() => onSearch(ref.current ? ref.current.value : "")}
          _hover={{ color: "var(--col-tertiary)" }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
