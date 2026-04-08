import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/subjects.api';

export const fetchSubjects = createAsyncThunk('subjects/fetchAll', async () => api.getSubjects());
export const addSubject    = createAsyncThunk('subjects/add', async (data) => api.createSubject(data));
export const editSubject   = createAsyncThunk('subjects/edit', async ({ id, data }) => api.updateSubject(id, data));
export const removeSubject = createAsyncThunk('subjects/remove', async (id) => {
  await api.deleteSubject(id); return id;
});

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending,   (s) => { s.loading = true; })
      .addCase(fetchSubjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchSubjects.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(addSubject.fulfilled,    (s, a) => { s.items.unshift(a.payload); })
      .addCase(editSubject.fulfilled,   (s, a) => {
        const i = s.items.findIndex(x => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(removeSubject.fulfilled, (s, a) => {
        s.items = s.items.filter(x => x.id !== a.payload);
      });
  },
});

export default subjectsSlice.reducer;
