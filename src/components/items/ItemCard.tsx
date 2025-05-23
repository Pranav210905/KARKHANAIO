import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Badge,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { Edit, Trash2 } from 'lucide-react';
import { Item } from '../../types';
import { useAppDispatch } from '../../hooks/useRedux';
import { updateItem, deleteItem } from '../../features/items/itemsSlice';
import { formatCurrency } from '../../utils/calculations';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [name, setName] = useState(item.name);
  const [cost, setCost] = useState(item.cost.toString());
  const [shippingCost, setShippingCost] = useState(item.shippingCost.toString());
  const [deliveryCost, setDeliveryCost] = useState(item.deliveryCost.toString());
  const [nameError, setNameError] = useState('');
  const [costError, setCostError] = useState('');
  const [shippingError, setShippingError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useAppDispatch();

  const totalCost = item.cost + item.shippingCost + item.deliveryCost;

  const handleUpdateItem = async () => {
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
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    await dispatch(updateItem({ 
      id: item.id, 
      name: name.trim(), 
      cost: costValue,
      shippingCost: shippingValue,
      deliveryCost: deliveryValue
    }));
    setIsSubmitting(false);
    onEditClose();
  };

  const handleDeleteItem = async () => {
    setIsSubmitting(true);
    await dispatch(deleteItem(item.id));
    setIsSubmitting(false);
    onDeleteClose();
  };

  return (
    <>
      <Box
        maxW="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        bg={useColorModeValue('white', 'gray.700')}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'md',
          borderColor: 'blue.300',
        }}
      >
        <Stack spacing={2}>
          <Flex justify="space-between" align="flex-start">
            <Heading size="md" noOfLines={2} title={item.name}>
              {item.name}
            </Heading>
            <Badge 
              colorScheme="blue" 
              fontSize="md" 
              px={2} 
              py={1} 
              borderRadius="md"
            >
              {formatCurrency(totalCost)}
            </Badge>
          </Flex>
          
          <Stack spacing={1}>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Base Cost: {formatCurrency(item.cost)}
            </Text>
            {item.shippingCost > 0 && (
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                Shipping: {formatCurrency(item.shippingCost)}
              </Text>
            )}
          </Stack>
          
          <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          
          <Flex justify="flex-end" mt={2}>
            <IconButton
              aria-label="Edit item"
              icon={<Edit size={16} />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              mr={2}
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete item"
              icon={<Trash2 size={16} />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={onDeleteOpen}
            />
          </Flex>
        </Stack>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isInvalid={!!nameError}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
                <FormErrorMessage>{nameError}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!costError}>
                <FormLabel>Base Cost</FormLabel>
                <Input
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Base cost"
                  type="number"
                  step="0.01"
                  min="0"
                />
                <FormErrorMessage>{costError}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl isInvalid={!!shippingError}>
                  <FormLabel>Shipping Cost</FormLabel>
                  <Input
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    placeholder="Shipping cost"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                  <FormErrorMessage>{shippingError}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!deliveryError}>
                  <FormLabel>Delivery Cost</FormLabel>
                  <Input
                    value={deliveryCost}
                    onChange={(e) => setDeliveryCost(e.target.value)}
                    placeholder="Delivery cost"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                  <FormErrorMessage>{deliveryError}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdateItem}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete "{item.name}"? This action cannot be undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteItem}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};