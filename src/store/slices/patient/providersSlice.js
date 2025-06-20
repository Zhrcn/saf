import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunks
export const fetchDoctors = createAsyncThunk(
    'providers/fetchDoctors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/doctors');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchPharmacists = createAsyncThunk(
    'providers/fetchPharmacists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/pharmacists');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchProviderDetails = createAsyncThunk(
    'providers/fetchProviderDetails',
    async ({ id, type }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/${type}/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    doctors: [],
    pharmacists: [],
    selectedProvider: null,
    loading: false,
    error: null,
};

const providersSlice = createSlice({
    name: 'providers',
    initialState,
    reducers: {
        clearProvidersError: (state) => {
            state.error = null;
        },
        clearSelectedProvider: (state) => {
            state.selectedProvider = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch doctors
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch doctors';
            })
            // Fetch pharmacists
            .addCase(fetchPharmacists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPharmacists.fulfilled, (state, action) => {
                state.loading = false;
                state.pharmacists = action.payload;
            })
            .addCase(fetchPharmacists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch pharmacists';
            })
            // Fetch provider details
            .addCase(fetchProviderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProviderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProvider = action.payload;
            })
            .addCase(fetchProviderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch provider details';
            });
    },
});

export const { clearProvidersError, clearSelectedProvider } = providersSlice.actions;
export default providersSlice.reducer; 