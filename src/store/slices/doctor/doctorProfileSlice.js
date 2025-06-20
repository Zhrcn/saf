import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorApi } from '../../services/doctor/doctorApi';

// Async thunks
export const fetchDoctorProfile = createAsyncThunk(
    'doctorProfile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await doctorApi.getProfile();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateDoctorProfile = createAsyncThunk(
    'doctorProfile/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await doctorApi.updateProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    profile: null,
    loading: false,
    error: null,
    success: false
};

const doctorProfileSlice = createSlice({
    name: 'doctorProfile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.success = false;
        },
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(fetchDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(updateDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfile, resetStatus } = doctorProfileSlice.actions;
export default doctorProfileSlice.reducer; 