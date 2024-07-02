import axiosInterceptor from '@/axios/axiosInterceptor';
import { ActivityArgs, ChangePasswordArgs, CreateActivityArgs, DeleteActivityArgs, DeleteFriendArgs, FriendRequestArgs, InitState, LoginArgs, RegisterArgs, UpdateActivityArgs } from '@/constants/interfaces';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios';
import activityParser from '../activityParser';
import { AlertSeverity, ConstantSnackMessages } from '@/constants/enums';

const initialState: InitState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  registered: false,
  snackbarMessage: '',
  events: [],
  users: [],
  open: false,
  severity: AlertSeverity.Success,
  sentFriendRequests: [],
  getFriendRequests: [],
}

export const registerUser = createAsyncThunk(
  'account/register',
  async (body: RegisterArgs, thunkAPI) => {
    try {
      const res = await axios.post('api/account/register', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 201) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;

        const message = error.response!.data.error;
        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const getUser = createAsyncThunk('account/user',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInterceptor.get('api/account/user', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const getUsers = createAsyncThunk('account/users',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInterceptor.get('api/account/users', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response!.data.error;
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const loginUser = createAsyncThunk(
  'account/login',
  async (body: LoginArgs, thunkAPI) => {
    try {
      const res = await axios.post('api/account/login', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(getUser());
        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;

        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const logoutUser = createAsyncThunk(
  'account/logout',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('api/account/logout', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;

        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));

        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const changePassword = createAsyncThunk(
  'account/profile/changepassword',
  async (body: ChangePasswordArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.put('api/account/changepassword', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;

        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const createActivity = createAsyncThunk(
  'calendar/activity/create',
  async (body: CreateActivityArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.post('api/activity/create', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 201) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: ConstantSnackMessages.NewActivityAdded,
        }));

        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const getUserActivities = createAsyncThunk('calendar/activity/load',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInterceptor.get('api/activity/load', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const updateAnActivity = createAsyncThunk(
  'calendar/activities/update',
  async (body: UpdateActivityArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.put('api/activity/update', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: ConstantSnackMessages.ActivityUpdated,
        }));
        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const deleteAnActivity = createAsyncThunk(
  'calendar/activities/delete',
  async (body: DeleteActivityArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.delete('api/activity/delete', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: body
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: ConstantSnackMessages.ActivityDeleted,
        }));
        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'profile/friend_request/send',
  async (body: FriendRequestArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.post('api/account/sendfriendrequest', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 201) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        dispatch(getSentFriendRequests()); // Update sent friend requests.
        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const getSentFriendRequests = createAsyncThunk(
  'profile/friend_request/getsend',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInterceptor.get('api/account/getsentfriendrequests', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response!.data.error;
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const getReceivedFriendRequests = createAsyncThunk(
  'profile/friend_request/getreceived',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInterceptor.get('api/account/getreceivedfriendrequests', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response!.data.error;
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const deleteFriendRequest = createAsyncThunk(
  'profile/friend_request/delete',
  async (body: FriendRequestArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.delete('api/account/removefriendrequest', {
        headers: {
          Accept: 'application/json',
        },
        data: body
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        dispatch(getSentFriendRequests()); // Update sent friend requests.
        dispatch(getReceivedFriendRequests()); // Update recieved friend requests.
        return res.data;
      }
      else {
        return thunkAPI.rejectWithValue(res.data);
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'profile/friend_request/accept',
  async (body: FriendRequestArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.post('api/account/acceptfriendrequest', body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));

        dispatch(getUser()); // Update current friends list.
        dispatch(getReceivedFriendRequests()); // Update received friend requests.
        return res.data;
      }
      else {
        return thunkAPI.rejectWithValue(res.data);
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const deleteFriend = createAsyncThunk(
  'profile/friend_request/deletefriend',
  async (body: DeleteFriendArgs, thunkAPI) => {
    try {
      const res = await axiosInterceptor.delete('api/account/deletefriend', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: body
      });

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(getUser()); // Update current friends list.
        dispatch(getUsers()); // Update current users.

        dispatch(showSnackbar({
          severity: AlertSeverity.Success,
          open: true,
          message: res.data.success,
        }));
        return res.data;
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { dispatch } = thunkAPI;
        const message = error.response!.data.error;

        dispatch(showSnackbar({
          severity: AlertSeverity.Error,
          open: true,
          message: message,
        }));
        return thunkAPI.rejectWithValue(message);
      }
      // Unhandled non-AxiosError 
      throw error
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetRegistered: state => {
      state.registered = false;
    },
    showSnackbar: (state, action) => {
      state.open = action.payload.open;
      state.severity = action.payload.severity;
      state.snackbarMessage = action.payload.message;
    },
    closeSnackbar: state => {
      state.open = false;
    },
    reset: () => initialState // Resets all the states in the redux store.
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, state => {
        state.registered = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, state=> {
        state.loading = false;
      })
      .addCase(loginUser.pending, state => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, state => {
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, state => {
        state.loading = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Save user data in state.
      })
      .addCase(getUser.rejected, state => {
        state.user = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {    
        const userList = action.payload.users
        for (let index = 0; index < userList.length; index++) {
          const anUser = userList[index];

          if(anUser.email === state.user!.email) {
            userList.splice(index, 1)
          }
        }

        state.users = userList; // Save all users in state users.
      })
      .addCase(getUsers.rejected, state => {
        state.user = null;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, state => {
        state.loading = false;
      })
      .addCase(changePassword.pending, state => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, state => {
        state.loading = false;
      })
      .addCase(createActivity.pending, state => {
        state.loading = true;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;

        state.events.push(activityParser(action.payload.success)); // Parses the payload and return an activity in correct json format.
      })
      .addCase(createActivity.rejected, state => {
        state.loading = false;
      })
      .addCase(getUserActivities.pending, state => {
        state.loading = true;
      })
      .addCase(getUserActivities.fulfilled, (state, action) => {
        state.loading = false;

        const eventList = action.payload.activities;
        let parsed_events: any[] = [];
        
        if(eventList) {
          eventList.forEach((event: ActivityArgs) => { // Parse all returned activities into correct json format for Fullcalendar API.
            parsed_events.push(activityParser(event));
          });
        }
        state.events = parsed_events;
      })
      .addCase(getUserActivities.rejected, state => {
        state.loading = false;
      })
      .addCase(updateAnActivity.pending, state => {
        state.loading = true;
      })
      .addCase(updateAnActivity.fulfilled, (state, action) => {
        state.loading = false;

        const updatedEvent = action.payload.success;
        const eventList = state.events;

        for (let index = 0; index < eventList.length; index++) {
          const event = eventList[index];
          if(event.id === updatedEvent.uuid) {
            eventList[index] = activityParser(updatedEvent); // Replace old event with the new updated event.
          }
        }

        state.events = eventList;
      })
      .addCase(updateAnActivity.rejected, state => {
        state.loading = false;
      })
      .addCase(deleteAnActivity.pending, state => {
        state.loading = true;
      })
      .addCase(deleteAnActivity.fulfilled, (state, action) => {
        state.loading = false;

        const deletedEventId = action.payload.success;
        const eventList = state.events;

        state.events = eventList.filter(event => event.id !== deletedEventId);
      })
      .addCase(deleteAnActivity.rejected, state => {
        state.loading = false;
      })
      .addCase(sendFriendRequest.pending, state => {
        state.loading = true;
      })
      .addCase(sendFriendRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(sendFriendRequest.rejected, state => {
        state.loading = false;
      })
      .addCase(getSentFriendRequests.fulfilled, (state, action) => {
        state.sentFriendRequests = action.payload.success;
      })
      .addCase(getReceivedFriendRequests.fulfilled, (state, action) => {
        state.getFriendRequests = action.payload.success;
      })
      .addCase(deleteFriendRequest.rejected, state => {
        state.loading = false;
      })
      .addCase(deleteFriendRequest.pending, state => {
        state.loading = true;
      })
      .addCase(deleteFriendRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(acceptFriendRequest.rejected, state => {
        state.loading = false;
      })
      .addCase(acceptFriendRequest.pending, state => {
        state.loading = true;
      })
      .addCase(acceptFriendRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(deleteFriend.rejected, state => {
        state.loading = false;
      })
      .addCase(deleteFriend.pending, state => {
        state.loading = true;
      })
      .addCase(deleteFriend.fulfilled, state => {
        state.loading = false;
      })
  },
});

export const {
  resetRegistered,
  showSnackbar,
  closeSnackbar,
  reset
} = authSlice.actions

export default authSlice.reducer
