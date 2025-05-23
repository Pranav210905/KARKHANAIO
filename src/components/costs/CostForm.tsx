import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { addCost } from '../../features/costs/costsSlice';

export const CostForm: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [amountError, setAmountError] = useState('');
  
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.costs);
  const { user } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    let isValid = true;
    
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setAmountError('Amount must be a positive number');
      isValid = false;
    } else {
      setAmountError('');
    }
    
    if (!isValid || !user) return;
    
    await dispatch(addCost({ 
      description: description.trim(), 
      amount: parseFloat(amount), 
      userId: user.uid 
    }));
    
    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'md'}
      p={6}
      mb={6}
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Heading as="h3" size="md" mb={4}>
        Add Other Cost
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="cost-description" isInvalid={!!descriptionError}>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter cost description"
            />
            <FormErrorMessage>{descriptionError}</FormErrorMessage>
          </FormControl>
          
          <FormControl id="cost-amount" isInvalid={!!amountError}>
            <FormLabel>Amount ($)</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <FormErrorMessage>{amountError}</FormErrorMessage>
          </FormControl>
          
          <Button
            colorScheme="teal"
            isLoading={isLoading}
            type="submit"
            width="full"
          >
            Add Cost
          </Button>
        </Stack>
      </form>
    </Box>
  );
};