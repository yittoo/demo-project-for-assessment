/**
 * All the favorite actions and data persistence is written here
 * originally was going to write it as a hook but hook for this purpose may not scale well
 * when the same hook is used by multiple UIs. It doesn't seem likely but
 * thought it'd not be impossible thus requiring a refactor in future
 * if this indeed was a real project so went ahead with context+reducer API
 */

import React, { useReducer, createContext } from "react";
import {
  IRepository,
  IRepositoryWithFavorite,
} from "../../types/githubApiResponses/repositories";

const LOCAL_STORAGE_KEY = "github-public-repositories-favorites";

export enum actionTypes {
  LOAD_FROM_LOCALSTORAGE,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
}

interface ILoadFromLocalStorage {
  (): IAction;
}
const loadFromLocalstorage: ILoadFromLocalStorage = (): IAction => {
  const loaded: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
  let loadedParsed = [];
  if (typeof loaded === "string") loadedParsed = JSON.parse(loaded);
  return {
    type: actionTypes.LOAD_FROM_LOCALSTORAGE,
    payload: loadedParsed,
  };
};

interface IToggleFavorite {
  (
    favorites: IRepositoryWithFavorite[],
    favoriteData: IRepositoryWithFavorite | IRepository
  ): IAction;
}
const toggleFavorite: IToggleFavorite = (
  favorites: IRepositoryWithFavorite[],
  favoriteData: IRepositoryWithFavorite | IRepository
): IAction => {
  const favoriteIndex = favorites.findIndex(
    (fav) => fav.id === favoriteData.id
  );
  const favoriteAlreadyExists = favoriteIndex !== -1;
  if (favoriteAlreadyExists) {
    return removeFavorite(favorites, favoriteIndex);
  } else {
    return addFavorite(favoriteData);
  }
};

interface IAddFavorite {
  (favoriteData: IRepository): IAction;
}
const addFavorite: IAddFavorite = (favoriteData: IRepository): IAction => {
  const now = Date.now();
  const favoriteDataWithTimeStamp: IRepositoryWithFavorite = {
    ...favoriteData,
    is_favorite: true,
    is_favorited_at: now,
  };
  return {
    type: actionTypes.ADD_FAVORITE,
    payload: favoriteDataWithTimeStamp,
  };
};

interface IRemoveFavorite {
  (
    favorites: IRepositoryWithFavorite[],
    indexOfFavoriteToRemove: number
  ): IAction;
}
const removeFavorite: IRemoveFavorite = (
  favorites: IRepositoryWithFavorite[],
  indexOfFavoriteToRemove: number
): IAction => {
  const copyFavorites: IRepositoryWithFavorite[] = [...favorites];
  copyFavorites.splice(indexOfFavoriteToRemove, 1);
  return {
    type: actionTypes.REMOVE_FAVORITE,
    payload: copyFavorites,
  };
};

export interface IFavoriteRepositoryContextActions {
  loadFromLocalstorage: ILoadFromLocalStorage;
  toggleFavorite: IToggleFavorite;
  addFavorite: IAddFavorite;
  removeFavorite: IRemoveFavorite;
}

const actions: IFavoriteRepositoryContextActions = {
  loadFromLocalstorage,
  toggleFavorite,
  addFavorite,
  removeFavorite,
};

export interface IFavoriteRepositoryContext {
  value: IRepositoryWithFavorite[];
  isInitialized: boolean;
  dispatch: React.Dispatch<IAction>;
  actions: IFavoriteRepositoryContextActions;
}
const initialState: IFavoriteRepositoryContext = {
  value: [],
  isInitialized: false,
  actions,
  dispatch: function () {}, // placeholder till it gets populated by useReducer's dispatch
};

const FavoriteRepositoryContext =
  createContext<IFavoriteRepositoryContext>(initialState);

FavoriteRepositoryContext.displayName = "FavoriteRepositoryContext";

export interface IAction {
  type: actionTypes;
  payload?: any;
}

const reducer: React.Reducer<IFavoriteRepositoryContext, IAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case actionTypes.LOAD_FROM_LOCALSTORAGE:
      return {
        ...state,
        isInitialized: true,
        value: payload,
      };
    case actionTypes.ADD_FAVORITE:
      return {
        ...state,
        // add to beginning of the list
        value: updateLocalstorageAndReturnFavorites([payload, ...state.value]),
      };
    case actionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        value: updateLocalstorageAndReturnFavorites([...payload]),
      };
    default:
      return state;
  }
};

const updateLocalstorageAndReturnFavorites = (
  newFavorites: IRepositoryWithFavorite[]
): IRepositoryWithFavorite[] => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites));
  return newFavorites;
};

export const FavoriteRepositoryConsumer = FavoriteRepositoryContext.Consumer;

export interface IFavoriteRepositoryProvider extends React.FunctionComponent {}

export const FavoriteRepositoryProvider: IFavoriteRepositoryProvider = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // initialize the store on Provider creation
  if (!state.isInitialized) dispatch(loadFromLocalstorage());
  return (
    <FavoriteRepositoryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FavoriteRepositoryContext.Provider>
  );
};
