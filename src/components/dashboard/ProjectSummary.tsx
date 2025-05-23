import React from 'react';
import { 
  Box, 
  Flex, 
  Stat, 
  StatLabel, 
  StatNumber, 
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react';
import { Item } from '../../types';
import { calculateItemsTotal, formatCurrency } from '../../utils/calculations';

interface ProjectSummaryProps {
  items: Item[];
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ items }) => {
  const totalBaseCost = items.reduce((sum, item) => sum + item.cost, 0);
  const totalShippingCost = items.reduce((sum, item) => sum + item.shippingCost, 0);
  const totalDeliveryCost = items.reduce((sum, item) => sum + item.deliveryCost, 0);
  const projectTotal = calculateItemsTotal(items);
  
  return (
    <Box
      p={5}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="md"
      mb={6}
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <StatCard
          label="Base Cost Total"
          value={formatCurrency(totalBaseCost)}
          color="blue.500"
          count={items.length}
        />
        <StatCard
          label="Shipping Total"
          value={formatCurrency(totalShippingCost)}
          color="teal.500"
        />
        <StatCard
          label="Delivery Total"
          value={formatCurrency(totalDeliveryCost)}
          color="purple.500"
        />
        <StatCard
          label="Project Total"
          value={formatCurrency(projectTotal)}
          color="green.500"
          highlight
        />
      </SimpleGrid>
    </Box>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  count?: number;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  color, 
  count,
  highlight = false 
}) => {
  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="md"
      bg={highlight ? `${color}` : 'transparent'}
      color={highlight ? 'white' : 'inherit'}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
    >
      <Stat>
        <StatLabel fontSize="sm" opacity={highlight ? 0.9 : 0.7}>
          {label} {count !== undefined && `(${count})`}
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold" color={highlight ? 'white' : color}>
          {value}
        </StatNumber>
      </Stat>
    </Flex>
  );
};