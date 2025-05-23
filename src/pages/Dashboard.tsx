import React, { useEffect } from 'react';
import { Box, Heading, Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { getItems } from '../features/items/itemsSlice';
import { Layout } from '../components/layout/Layout';
import { ProjectSummary } from '../components/dashboard/ProjectSummary';
import { ItemForm } from '../components/items/ItemForm';
import { ItemsList } from '../components/items/ItemsList';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items, isLoading: itemsLoading, error: itemsError } = useAppSelector(state => state.items);
  
  useEffect(() => {
    if (user) {
      dispatch(getItems(user.uid));
    }
  }, [dispatch, user]);
  
  if (!user) {
    return null;
  }
  
  if (itemsLoading) {
    return (
      <Layout>
        <Center h="60vh">
          <Spinner size="xl" thickness="4px" color="blue.500" />
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={6}>
          Project Dashboard
        </Heading>
        
        {itemsError && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {itemsError}
          </Alert>
        )}
        
        <ProjectSummary items={items} />
        
        <ItemForm />
        
        <ItemsList items={items} />
      </Box>
    </Layout>
  );
};