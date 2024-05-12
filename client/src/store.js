import subscribeSlice from '@Slices/subscribeSlice';
import boxSlice from '@Slices/boxSlice';
import userSlice from '@Slices/userSlice';
import infoSlice from '@Slices/infoSlice';
import dictionarySlice from '@Slices/dictionarySlice';
import deliverySlice from '@Slices/deliverySlice';
import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
	userStore: userSlice,
	boxesStore: boxSlice,
	subscribesStore: subscribeSlice,
	dictionariesStore: dictionarySlice,
	deliveryStore: deliverySlice,
	infoStore: infoSlice,
  });

const persistConfig = {
	key: 'root',
	storage,
	version: 3,
	whitelist: ['subscribesStore'],
	blacklist: ['userStore'],
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

const persistor = persistStore(store);

export { store, persistor }