import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Stack, 
  useColorModeValue, 
  useDisclosure,
  IconButton,
  HStack,
  Collapse
} from '@chakra-ui/react';
import { CircleDollarSign, Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { signOut } from '../../features/auth/authSlice';

export const Navbar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <X size={24} /> : <Menu size={24} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <HStack spacing={2}>
            <CircleDollarSign size={24} color="#3B82F6" />
            <Text
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              fontWeight="bold"
              color={useColorModeValue('gray.800', 'white')}
            >
              Project Cost Tracker
            </Text>
          </HStack>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 1 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {user ? (
            <Button
              fontSize={'sm'}
              fontWeight={400}
              variant={'outline'}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <span></span>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const { user } = useAppSelector(state => state.auth);
  
  if (!user) return null;
  
  return (
    <Stack direction={'row'} spacing={4}>
      <Box
        p={2}
        fontSize={'sm'}
        fontWeight={500}
        color={useColorModeValue('gray.600', 'gray.200')}
        _hover={{
          textDecoration: 'none',
          color: useColorModeValue('gray.800', 'white'),
        }}
      >
        Dashboard
      </Box>
    </Stack>
  );
};

const MobileNav = () => {
  const { user } = useAppSelector(state => state.auth);
  
  if (!user) return null;
  
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      <Stack
        borderRadius="md"
        _hover={{
          bg: useColorModeValue('gray.50', 'gray.700'),
        }}
        p={2}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          Dashboard
        </Text>
      </Stack>
    </Stack>
  );
};