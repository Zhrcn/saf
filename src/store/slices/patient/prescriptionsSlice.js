import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { prescriptionApi } from '@/store/services/patient/prescriptionApi';

const initialState = {
    prescriptions: [],
    activePrescriptions: [],
    loading: false,
    error: null,
};

export const fetchPrescriptions = createAsyncThunk(
    'prescriptions/fetchPrescriptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await prescriptionApi.getPrescriptions();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchActivePrescriptions = createAsyncThunk(
    'prescriptions/fetchActivePrescriptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await prescriptionApi.getActivePrescriptions();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const prescriptionsSlice = createSlice({
    name: 'prescriptions',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all prescriptions
            .addCase(fetchPrescriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrescriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions = action.payload;
            })
            .addCase(fetchPrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch active prescriptions
            .addCase(fetchActivePrescriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivePrescriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.activePrescriptions = action.payload;
            })
            .addCase(fetchActivePrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = prescriptionsSlice.actions;
export default prescriptionsSlice.reducer; 