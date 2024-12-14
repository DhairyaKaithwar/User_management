import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { users } from '../assets/data';

// Define a type for User
interface User {
  id: number; // Updated to match the data
  name: string;
  // Add other properties relevant to your user object here
}

// Define the initial state type
interface UserState {
  allUsers: User[];
  deletedUsers: User[];
}

const initialState: UserState = {
  allUsers: users,
  deletedUsers: [], // New state to track deleted users
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    deleteUser: (state, action: PayloadAction<number>) => { // Adjusted to use number
      const deletedUser = state.allUsers.find((user) => user.id === action.payload);

      if (deletedUser) {
        state.deletedUsers.push(deletedUser); // Add deleted user to the deletedUsers array
        state.allUsers = state.allUsers.filter((user) => user.id !== action.payload); // Remove from allUsers
      }
    },
  },
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;
