import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Api_BASE_URL } from "../utils/config";

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;

  profile_image?: string | null;
}

export const fetchClients = createAsyncThunk("clients/fetchClients", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${Api_BASE_URL}/clients/`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    
    const safeData = res.data.map((client: any) => ({
      ...client,
      profile_image: client.profile_image ?? null,
    }));

    return safeData as Client[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteClient = createAsyncThunk("clients/deleteClient", async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${Api_BASE_URL}/clients/${id}/`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

type ClientsState = {
  clients: Client[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  deleting: boolean;
};

const initialState: ClientsState = {
  clients: [],
  status: "idle",
  error: null,
  deleting: false,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(deleteClient.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.deleting = false;
        state.clients = state.clients.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const selectClients = (state: any) => state.clients.clients;
export const selectClientsStatus = (state: any) => state.clients.status;
export const selectClientsError = (state: any) => state.clients.error;
export const selectClientsDeleting = (state: any) => state.clients.deleting;

export default clientsSlice.reducer;
