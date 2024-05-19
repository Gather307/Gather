import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { CSSProperties, useRef } from "react";
import { IoSearch } from "react-icons/io5";

interface Props {
  onSearch: (searchText: string) => void;
  placeholder: string;
  style?: CSSProperties;
  width?: string;
}

const SearchBar = ({
  onSearch,
  placeholder,
  width = "auto",
  style = {},
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) onSearch(ref.current.value);
      }}
      style={{
        display: "inline",
      }}
    >
      <InputGroup display="inline" width={width} style={style}>
        <Input
          ref={ref}
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
          />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default SearchBar;
