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

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
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
      });
  },
});

export default bookingsSlice.reducer;
