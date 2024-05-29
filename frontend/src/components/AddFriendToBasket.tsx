import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Box,
    HStack,
    Text,
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  import {} from "@chakra-ui/react";
  
  //Add Radio for boolean
  //Number input for number type
  
  interface Props {
    basketId: string;
    user: any
  }
  
  const EditBasket: React.FC<Props> = ({ basketId }) => {