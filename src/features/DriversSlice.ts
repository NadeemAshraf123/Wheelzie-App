
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../app/store";
import { Api_BASE_URL } from "../utils/config";

export type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  profile_image?: string;
  address?: string | null;
  total_hours?: number | null;
  total_trips?: number | null;
  performance_rating?: number | null;
  schedule?: { date: string; assignment: string; vehicle?: string }[];
};



export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${Api_BASE_URL}/drivers/`, {
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
  async (driverData: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", driverData.name);
      formData.append("email", driverData.email);
      formData.append("phone", driverData.phone);
      formData.append("status", driverData.status);
      formData.append("total_hours", driverData.total_hours.toString());
      formData.append("total_trips", driverData.total_trips.toString());
      formData.append("performance_rating", driverData.performance_rating.toString());

      if (driverData.profileImage && driverData.profileImage.length > 0) {
        formData.append("profile_image", driverData.profileImage[0]);
      }

      const res = await axios.post(`${Api_BASE_URL}/drivers/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
      });

      return res.data as Driver;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const updateDriver = createAsyncThunk(
  "drivers/updateDriver",
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${Api_BASE_URL}/drivers/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data", 
          "ngrok-skip-browser-warning": "true",
        },
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
      await axios.delete(`${Api_BASE_URL}/drivers/${id}/`);
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
