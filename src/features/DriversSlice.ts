
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../app/store";

export type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  profile_image?: string;
  address?: string | null;
  schedule?: { date: string; assignment: string; vehicle?: string }[];
};

// const API_BASE = "https://54d665185c0f.ngrok-free.app";
const API_BASE = "http://192.168.0.79:8000/";


export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/drivers/`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      return res.data as Driver[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addDriver = createAsyncThunk(
  "drivers/addDriver",
  async (driverData: Partial<Driver>, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/drivers/`, driverData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data as Driver;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateDriver = createAsyncThunk(
  "drivers/updateDriver",
  async (driverData: Driver, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_BASE}/drivers/${driverData.id}/`, driverData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data as Driver;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteDriver = createAsyncThunk(
  "drivers/deleteDriver",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/drivers/${id}/`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

type DriversState = {
  drivers: Driver[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: DriversState = {
  drivers: [],
  status: "idle",
  error: null,
};

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchDrivers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any) || action.error.message || "Failed to fetch drivers";
      })

      
      .addCase(addDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
      })
      .addCase(addDriver.rejected, (state, action) => {
        state.error = (action.payload as any) || action.error.message || "Failed to add driver";
      })

    
      .addCase(updateDriver.fulfilled, (state, action) => {
        const idx = state.drivers.findIndex((d) => d.id === action.payload.id);
        if (idx >= 0) state.drivers[idx] = action.payload;
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.error = (action.payload as any) || action.error.message || "Failed to update driver";
      })

      
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.error = (action.payload as any) || action.error.message || "Failed to delete driver";
      });
  },
});

export const selectDrivers = (state: RootState) => state.drivers.drivers;
export const selectDriversStatus = (state: RootState) => state.drivers.status;
export const selectDriversError = (state: RootState) => state.drivers.error;
export const selectDriverById = (id: number) => (state: RootState) =>
  state.drivers.drivers.find((d) => d.id === id);

export default driversSlice.reducer;
