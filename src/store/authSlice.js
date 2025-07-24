import { createSlice } from "@reduxjs/toolkit";
import authService from "../appwrite/auth";

const initialState = {
  status: false,
  userData: null,
  loading: true // Add loading state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.loading = false;
    },
    setAuth: (state, action) => {
      state.status = action.payload.status;
      state.userData = action.payload.userData;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

// Add this thunk to verify session on refresh
export const verifySession = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const userData = await authService.getCurrentUser();
    dispatch(setAuth({
      status: !!userData,
      userData: userData || null
    }));
  } catch (error) {
    dispatch(setAuth({
      status: false,
      userData: null
    }));
  }
};

export const { login, logout, setAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;