import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Api_BASE_URL } from "../utils/config";

export type Car = {
  id: number;
  name: string;
  model_type: string | null;
  license_plate: string;
  daily_rate: number | null;
  image?: string;
};


export const fetchCars = createAsyncThunk("cars/fetchCars", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${Api_BASE_URL}/cars/`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return res.data as Car[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addCar = createAsyncThunk(
  "cars/addCar",
  async (carData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${Api_BASE_URL}/cars/`, carData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      return res.data as Car;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async (carData: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${Api_BASE_URL}/cars/${carData.id}/`, carData.formData, {
        headers: {
          "ngrok-skip-browser-warning": "true", // 🔹 ADDED
        },
      });
      return res.data as Car;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCar = createAsyncThunk("cars/deleteCar", async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${Api_BASE_URL}/cars/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

type CarsState = {
  cars: Car[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: CarsState = {
  cars: [],
  status: "idle",
  error: null,
};

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(addCar.fulfilled, (state, action) => {
        state.cars.push(action.payload);
      })
      .addCase(addCar.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateCar.fulfilled, (state, action) => {
        const idx = state.cars.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.cars[idx] = action.payload;
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectCars = (state: any) => state.cars.cars;
export const selectCarsStatus = (state: any) => state.cars.status;
export const selectCarsError = (state: any) => state.cars.error;

export default carsSlice.reducer;
