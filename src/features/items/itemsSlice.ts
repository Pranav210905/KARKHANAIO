import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Item } from '../../types';

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  isLoading: false,
  error: null,
};

// Get items
export const getItems = createAsyncThunk(
  'items/getItems',
  async (userId: string, { rejectWithValue }) => {
    try {
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const items: Item[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
        
        items.push({
          id: doc.id,
          name: data.name,
          cost: data.cost,
          shippingCost: data.shippingCost || 0,
          deliveryCost: data.deliveryCost || 0,
          userId: data.userId,
          createdAt: createdAt,
        });
      });
      
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add item
export const addItem = createAsyncThunk(
  'items/addItem',
  async ({ 
    name, 
    cost, 
    shippingCost, 
    deliveryCost, 
    userId 
  }: { 
    name: string; 
    cost: number; 
    shippingCost: number;
    deliveryCost: number;
    userId: string 
  }, { rejectWithValue }) => {
    try {
      const itemsRef = collection(db, 'items');
      const docRef = await addDoc(itemsRef, {
        name,
        cost,
        shippingCost,
        deliveryCost,
        userId,
        createdAt: serverTimestamp(),
      });
      
      return {
        id: docRef.id,
        name,
        cost,
        shippingCost,
        deliveryCost,
        userId,
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update item
export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ 
    id, 
    name, 
    cost,
    shippingCost,
    deliveryCost 
  }: { 
    id: string; 
    name: string; 
    cost: number;
    shippingCost: number;
    deliveryCost: number;
  }, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        name,
        cost,
        shippingCost,
        deliveryCost,
      });
      
      return { id, name, cost, shippingCost, deliveryCost };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, 'items', id);
      await deleteDoc(itemRef);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItemsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get items
      .addCase(getItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add item
      .addCase(addItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, name, cost, shippingCost, deliveryCost } = action.payload;
        const existingItem = state.items.find(item => item.id === id);
        if (existingItem) {
          existingItem.name = name;
          existingItem.cost = cost;
          existingItem.shippingCost = shippingCost;
          existingItem.deliveryCost = deliveryCost;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearItemsError } = itemsSlice.actions;

export default itemsSlice.reducer;