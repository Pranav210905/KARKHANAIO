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
  SimpleGrid,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { addItem } from '../../features/items/itemsSlice';

export const ItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [deliveryCost, setDeliveryCost] = useState('');
  const [nameError, setNameError] = useState('');
  const [costError, setCostError] = useState('');
  const [shippingError, setShippingError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');
  
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.items);
  const { user } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    const costValue = parseFloat(cost);
    if (isNaN(costValue) || costValue <= 0) {
      setCostError('Cost must be a positive number');
      isValid = false;
    } else {
      setCostError('');
    }

    const shippingValue = parseFloat(shippingCost || '0');
    if (isNaN(shippingValue) || shippingValue < 0) {
      setShippingError('Shipping cost must be a non-negative number');
      isValid = false;
    } else {
      setShippingError('');
    }

    const deliveryValue = parseFloat(deliveryCost || '0');
    if (isNaN(deliveryValue) || deliveryValue < 0) {
      setDeliveryError('Delivery cost must be a non-negative number');
      isValid = false;
    } else {
      setDeliveryError('');
    }
    
    if (!isValid || !user) return;
    
    await dispatch(addItem({ 
      name: name.trim(), 
      cost: costValue,
      shippingCost: shippingValue,
      deliveryCost: deliveryValue,
      userId: user.uid 
    }));
    
    // Reset form
    setName('');
    setCost('');
    setShippingCost('');
    setDeliveryCost('');
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
        Add New Item
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="item-name" isInvalid={!!nameError}>
            <FormLabel>Item Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
            />
            <FormErrorMessage>{nameError}</FormErrorMessage>
          </FormControl>
          
          <FormControl id="item-cost" isInvalid={!!costError}>
            <FormLabel>Base Cost ($)</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Enter base cost"
            />
            <FormErrorMessage>{costError}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl id="shipping-cost" isInvalid={!!shippingError}>
              <FormLabel>Shipping Cost ($)</FormLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                placeholder="Enter shipping cost"
              />
              <FormErrorMessage>{shippingError}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
          
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            type="submit"
            width="full"
          >
            Add Item
          </Button>
        </Stack>
      </form>
    </Box>
  );
};