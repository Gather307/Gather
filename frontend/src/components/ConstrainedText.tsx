import { Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

interface Props {
  text: string;
  charLimit: number;
  style?: CSSProperties;
  prefix?: string;
  postfix?: string;
}

//Displays as much of provided text as it can, up to limit. Can prefix + postfix text.
const ConstrainedText = ({
  text,
  charLimit,
  prefix = "",
  postfix = "",
  style = {},
}: Props) => {
  return (
    <Text style={style}>
      {prefix}
      {text.length <= charLimit
        ? text
        : text.substring(0, Math.max(charLimit - postfix.length, 0))}
      <Text as="i">{text.length <= charLimit ? "" : postfix}</Text>
    </Text>
  );
};

export default ConstrainedText;
