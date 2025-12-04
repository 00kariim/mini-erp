import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import clientsReducer from './slices/clientsSlice';
import claimsReducer from './slices/claimsSlice';
import usersReducer from './slices/userSlice';
import rolesReducer from './slices/rolesSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    clients: clientsReducer,
    claims: claimsReducer,
    users: usersReducer,
    roles: rolesReducer,
    products: productsReducer,
  },
});
