import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Api_BASE_URL } from "../utils/config";

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => {
    const response = await axios.get(`${Api_BASE_URL}/bookings/`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return response.data;
  }
);

export const addBooking = createAsyncThunk(
  "bookings/addBooking",
  async (bookingData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Api_BASE_URL}/bookings/`,
        bookingData,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add booking");
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async (
    { id, bookingData }: { id: number; bookingData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${Api_BASE_URL}/bookings/${id}/`,
        bookingData,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update booking");
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${Api_BASE_URL}/bookings/${id}/`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete booking");
    }
  }
);

interface BookingsState {
  data: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any | null;
}

const initialState: BookingsState = {
  data: [],
  status: "idle",
  error: null,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      
      .addCase(addBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add booking";
      })

      
      .addCase(updateBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.data.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update booking";
      })

      
      .addCase(deleteBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete booking";
      });
  },
});

export default bookingsSlice.reducer;
