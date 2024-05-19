import {
  Box,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";
import "../styles/CompactGroup.css";

interface Props {
  width: string;
  height: string;
}

const SkeletonGroup = ({ width, height }: Props) => {
  return (
    <Box
      width={width}
      height={height}
      className="container"
      padding="15px 40px 20px"
      borderRadius="25%"
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir="row"
          width="100%"
          height="20%"
        >
          <SkeletonCircle width="28" height="16" marginRight="20%" />
          <SkeletonText width="100%" noOfLines={1} />
        </Box>
      </VStack>
    </Box>
  );
};

export default SkeletonGroup;
