import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useRef } from "react";
import { IoSearch } from "react-icons/io5";

interface Props {
  onSearch: (searchText: string) => void;
  placeholder: string;
  width?: string;
}

const SearchBar = ({ onSearch, placeholder, width = "auto" }: Props) => {
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
      <InputGroup display="inline" bgColor="rgba(100,100,100,1)">
        <Input
          ref={ref}
          placeholder={placeholder}
          width={width}
          borderColor="rgba(0,0,0,0)"
          padding="5px"
          paddingLeft="15px"
          fontStyle="italic"
          letterSpacing="2px"
          fontSize="0.85rem"
          color="rgba(255,255,255,1)"
          display="flex"
        />
        <InputRightElement>
          <Icon as={IoSearch} />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default SearchBar;
