import React from 'react';
import { Box, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { CircleDollarSign } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';

export const Login: React.FC = () => {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} w={{ base: 'full', md: 'lg' }} py={12} px={6}>
        <Stack align={'center'}>
          <CircleDollarSign size={48} color="#3B82F6" />
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Project Cost Tracker
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Manage and track all your project expenses ✨
          </Text>
        </Stack>
        <AuthForm />
      </Stack>
    </Flex>
  );
};