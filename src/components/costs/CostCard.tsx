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
} from '@chakra-ui/react';
import { Edit, Trash2 } from 'lucide-react';
import { OtherCost } from '../../types';
import { useAppDispatch } from '../../hooks/useRedux';
import { updateCost, deleteCost } from '../../features/costs/costsSlice';
import { formatCurrency } from '../../utils/calculations';

interface CostCardProps {
  cost: OtherCost;
}

export const CostCard: React.FC<CostCardProps> = ({ cost }) => {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [description, setDescription] = useState(cost.description);
  const [amount, setAmount] = useState(cost.amount.toString());
  const [descriptionError, setDescriptionError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useAppDispatch();

  const handleUpdateCost = async () => {
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
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    await dispatch(updateCost({ 
      id: cost.id, 
      description: description.trim(), 
      amount: parseFloat(amount) 
    }));
    setIsSubmitting(false);
    onEditClose();
  };

  const handleDeleteCost = async () => {
    setIsSubmitting(true);
    await dispatch(deleteCost(cost.id));
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
          borderColor: 'teal.300',
        }}
      >
        <Stack spacing={2}>
          <Flex justify="space-between" align="flex-start">
            <Heading size="md" noOfLines={2} title={cost.description}>
              {cost.description}
            </Heading>
            <Badge 
              colorScheme="teal" 
              fontSize="md" 
              px={2} 
              py={1} 
              borderRadius="md"
            >
              {formatCurrency(cost.amount)}
            </Badge>
          </Flex>
          
          <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
            Added on {new Date(cost.createdAt).toLocaleDateString()}
          </Text>
          
          <Flex justify="flex-end" mt={2}>
            <IconButton
              aria-label="Edit cost"
              icon={<Edit size={16} />}
              size="sm"
              colorScheme="teal"
              variant="ghost"
              mr={2}
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete cost"
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
          <ModalHeader>Edit Other Cost</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isInvalid={!!descriptionError}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cost description"
                />
                <FormErrorMessage>{descriptionError}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!amountError}>
                <FormLabel>Amount</FormLabel>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Cost amount"
                  type="number"
                  step="0.01"
                  min="0"
                />
                <FormErrorMessage>{amountError}</FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleUpdateCost}
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
          <ModalHeader>Delete Cost</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete "{cost.description}"? This action cannot be undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteCost}
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