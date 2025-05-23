import React from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { OtherCost } from '../../types';
import { CostCard } from './CostCard';

interface CostsListProps {
  costs: OtherCost[];
}

export const CostsList: React.FC<CostsListProps> = ({ costs }) => {
  if (costs.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500">No other costs added yet</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Other Costs
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {costs.map((cost) => (
          <CostCard key={cost.id} cost={cost} />
        ))}
      </SimpleGrid>
    </Box>
  );
};