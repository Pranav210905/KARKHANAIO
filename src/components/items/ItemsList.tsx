import React from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Item } from '../../types';
import { ItemCard } from './ItemCard';

interface ItemsListProps {
  items: Item[];
}

export const ItemsList: React.FC<ItemsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500">No items added yet</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Project Items
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};