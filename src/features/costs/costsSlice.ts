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
import { OtherCost } from '../../types';

interface CostsState {
  costs: OtherCost[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CostsState = {
  costs: [],
  isLoading: false,
  error: null,
};

// Get costs
export const getCosts = createAsyncThunk(
  'costs/getCosts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, 'otherCosts');
      const q = query(costsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const costs: OtherCost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
        
        costs.push({
          id: doc.id,
          description: data.description,
          amount: data.amount,
          userId: data.userId,
          createdAt: createdAt,
        });
      });
      
      return costs;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add cost
export const addCost = createAsyncThunk(
  'costs/addCost',
  async ({ description, amount, userId }: { description: string; amount: number; userId: string }, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, 'otherCosts');
      const docRef = await addDoc(costsRef, {
        description,
        amount,
        userId,
        createdAt: serverTimestamp(),
      });
      
      return {
        id: docRef.id,
        description,
        amount,
        userId,
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update cost
export const updateCost = createAsyncThunk(
  'costs/updateCost',
  async ({ id, description, amount }: { id: string; description: string; amount: number }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'otherCosts', id);
      await updateDoc(costRef, {
        description,
        amount,
      });
      
      return { id, description, amount };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete cost
export const deleteCost = createAsyncThunk(
  'costs/deleteCost',
  async (id: string, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'otherCosts', id);
      await deleteDoc(costRef);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const costsSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    clearCostsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get costs
      .addCase(getCosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.costs = action.payload;
      })
      .addCase(getCosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add cost
      .addCase(addCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.costs.push(action.payload);
      })
      .addCase(addCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cost
      .addCase(updateCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCost.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, description, amount } = action.payload;
        const existingCost = state.costs.find(cost => cost.id === id);
        if (existingCost) {
          existingCost.description = description;
          existingCost.amount = amount;
        }
      })
      .addCase(updateCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete cost
      .addCase(deleteCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.costs = state.costs.filter(cost => cost.id !== action.payload);
      })
      .addCase(deleteCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCostsError } = costsSlice.actions;

export default costsSlice.reducer;