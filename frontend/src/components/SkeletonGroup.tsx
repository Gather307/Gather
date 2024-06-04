import { Box, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";
import "../styles/CompactGroup.css";

interface Props {
  width: string;
  height: string;
  corners?: boolean[]; // TL, TR, BR, BL
}

const SkeletonGroup = ({
  width,
  height,
  corners = [false, false, false, false],
}: Props) => {
  return (
    <Box
      width={width}
      height={height}
      className="container"
      padding="15px 40px 20px"
      borderRadius={`${corners[0] ? "0%" : "20%"} ${
        corners[1] ? "0%" : "20%"
      } ${corners[2] ? "0%" : "20%"} ${corners[3] ? "0%" : "20%"}`}
      position="relative"
    >
      <VStack height="100%" justifyContent="space-between">
        <Skeleton height="15%" width="50%" borderRadius="10px" />
        <SkeletonText
          width="100%"
          flexGrow="20"
          noOfLines={4}
          mt="4"
          spacing="4"
          skeletonHeight="2"
        />
        <SkeletonText width="80%" noOfLines={1} />
      </VStack>
    </Box>
  );
};

export default SkeletonGroup;
