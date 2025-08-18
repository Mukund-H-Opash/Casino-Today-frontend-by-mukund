import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { useDispatch } from 'react-redux';

import counterReducer from "./counter/counterSlice";
import CustomizerReducer from "./customizer/CustomizerSlice";

import UserProfileReducer from "./apps/userProfile/UserProfileSlice";


// new importsas par casinotoday api
import authReducer from './apps/auth/authSlice';
import casinoReducer from './apps/casinoReview/casinoSlice';
import gameReducer from './apps/games/gameSlice';
import bonuseReducer from './apps/bonuses/bonuseSlice';
import customPageReducer from './apps/custom-pages/CustomPageSlice';
import mediaPageReducer from './apps/media/mediaSlice';
import UsersettingReducer from './apps/users/userSlice';
import PermissionsReducer from './apps/Permissions/PermissionSlice';
import genrelsettingReducer from './apps/settings/genrelsettingSlice';
import accesslogReducer from './apps/accesslogs/accesslogSlice';
import casinoTagsReducer from './apps/casinoReview/CasinoTagsSlice';
import casinoCountriesReducer from './apps/casinoReview/CasinoCountriesSlice';
import casinoLanguagesReducer from './apps/casinoReview/CasinoLanguagesSlice';
import casinoLicencesReducer from './apps/casinoReview/CasinoLicencesSlice';
import bonusTagsReducer from './apps/bonuses/BonusTagsSlice';
import bonusTypesReducer from './apps/bonuses/BonusTypesSlice';
import gameTagsReducer from './apps/games/GameTagsSlice';
import gameTypesReducer from './apps/games/GameTypesSlice';
import softwareProvidersReducer from './apps/games/SoftwareProvidersSlice';
import casinoPlatformsReducer from './apps/casinoReview/CasinoPlatfromsSlice';
import gameFeaturesReducer from './apps/games/GameFeaturesSlice';
import dashboardReducer from './apps/Dashboard/DashboardSlice';

const persistConfig = {
  key: "root",
  storage,
   whitelist: ['auth'],
  blacklist: ['casinos'],
};


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: persistReducer<any>(persistConfig, CustomizerReducer),
    userpostsReducer: UserProfileReducer,

    // auth
        auth: authReducer,
        casinos: casinoReducer,
        games: gameReducer,
        bonus: bonuseReducer,
        customPages: customPageReducer,
        media: mediaPageReducer,
        user: UsersettingReducer,
        permissions: PermissionsReducer,
        genrelsetting: genrelsettingReducer,
        accesslogs: accesslogReducer,
        casinoTags: casinoTagsReducer,
        casinoCountries: casinoCountriesReducer,
        casinoLanguages: casinoLanguagesReducer,
        casinoLicences: casinoLicencesReducer,
        bonusTags: bonusTagsReducer,
        bonusTypes: bonusTypesReducer,
        gameTags: gameTagsReducer,
        gameTypes: gameTypesReducer,
        softwareProviders: softwareProvidersReducer,
        casinoPlatforms: casinoPlatformsReducer,
        gameFeatures: gameFeaturesReducer,
        dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = RootState;

