import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/schedules.api';
import { completeSession, skipSession } from '../api/sessions.api';

export const fetchActiveSchedule = createAsyncThunk('schedule/fetchActive', async (_, { rejectWithValue }) => {
  try { return await api.getActiveSchedule(); }
  catch (err) {
    if (err.response?.status === 404) return null;
    return rejectWithValue(err.response?.data?.error);
  }
});

export const generateNewSchedule = createAsyncThunk('schedule/generate', async (_, { rejectWithValue }) => {
  try { return await api.generateSchedule(); }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to generate schedule'); }
});

export const markComplete = createAsyncThunk('schedule/complete', async (sessionId) =>
  completeSession(sessionId)
);
export const markSkip = createAsyncThunk('schedule/skip', async (sessionId) =>
  skipSession(sessionId)
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: { data: null, loading: false, generating: false, error: null },
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSchedule.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchActiveSchedule.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
      .addCase(fetchActiveSchedule.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(generateNewSchedule.pending,   (s) => { s.generating = true; s.error = null; })
      .addCase(generateNewSchedule.fulfilled, (s, a) => {
        s.generating = false;
        s.data = { ...a.payload.schedule, sessions: a.payload.sessions };
      })
      .addCase(generateNewSchedule.rejected,  (s, a) => { s.generating = false; s.error = a.payload; })
      .addCase(markComplete.fulfilled, (s, a) => {
        if (s.data?.sessions) {
          const i = s.data.sessions.findIndex(x => x.id === a.payload.id);
          if (i !== -1) s.data.sessions[i] = { ...s.data.sessions[i], ...a.payload };
        }
      })
      .addCase(markSkip.fulfilled, (s, a) => {
        if (s.data?.sessions) {
          const i = s.data.sessions.findIndex(x => x.id === a.payload.id);
          if (i !== -1) s.data.sessions[i] = { ...s.data.sessions[i], ...a.payload };
        }
      });
  },
});

export const { clearError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
