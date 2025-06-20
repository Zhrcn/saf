import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { consultationApi } from '@/store/services/patient/consultationApi';

const initialState = {
    consultations: [],
    loading: false,
    error: null,
};

export const fetchConsultations = createAsyncThunk(
    'consultations/fetchConsultations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await consultationApi.getConsultations();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createConsultation = createAsyncThunk(
    'consultations/createConsultation',
    async (consultationData, { rejectWithValue }) => {
        try {
            const response = await consultationApi.createConsultation(consultationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateConsultation = createAsyncThunk(
    'consultations/updateConsultation',
    async ({ id, consultationData }, { rejectWithValue }) => {
        try {
            const response = await consultationApi.updateConsultation(id, consultationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const consultationsSlice = createSlice({
    name: 'consultations',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch consultations
            .addCase(fetchConsultations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConsultations.fulfilled, (state, action) => {
                state.loading = false;
                state.consultations = action.payload;
            })
            .addCase(fetchConsultations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create consultation
            .addCase(createConsultation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createConsultation.fulfilled, (state, action) => {
                state.loading = false;
                state.consultations.push(action.payload);
            })
            .addCase(createConsultation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update consultation
            .addCase(updateConsultation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateConsultation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.consultations.findIndex(
                    (consultation) => consultation.id === action.payload.id
                );
                if (index !== -1) {
                    state.consultations[index] = action.payload;
                }
            })
            .addCase(updateConsultation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = consultationsSlice.actions;
export default consultationsSlice.reducer; 