import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  recommendations: [],
  watchlist: [],
  genres: [],
  loading: false,
  error: null,
  currentAnalysis: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_RECOMMENDATIONS: "SET_RECOMMENDATIONS",
  SET_WATCHLIST: "SET_WATCHLIST",
  SET_GENRES: "SET_GENRES",
  ADD_TO_WATCHLIST: "ADD_TO_WATCHLIST",
  REMOVE_FROM_WATCHLIST: "REMOVE_FROM_WATCHLIST",
  SET_CURRENT_ANALYSIS: "SET_CURRENT_ANALYSIS",
  CLEAR_RECOMMENDATIONS: "CLEAR_RECOMMENDATIONS",
};

// Reducer
const movieReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload,
        loading: false,
        error: null,
      };
    case ActionTypes.SET_WATCHLIST:
      return {
        ...state,
        watchlist: action.payload,
      };
    case ActionTypes.SET_GENRES:
      return {
        ...state,
        genres: action.payload,
      };
    case ActionTypes.ADD_TO_WATCHLIST:
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    case ActionTypes.REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (movie) => movie._id !== action.payload
        ),
      };
    case ActionTypes.SET_CURRENT_ANALYSIS:
      return {
        ...state,
        currentAnalysis: action.payload,
      };
    case ActionTypes.CLEAR_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: [],
        currentAnalysis: null,
      };
    default:
      return state;
  }
};

// Context
const MovieContext = createContext();

// Provider component
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Actions
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setRecommendations = (recommendations) => {
    dispatch({
      type: ActionTypes.SET_RECOMMENDATIONS,
      payload: recommendations,
    });
  };

  const setWatchlist = (watchlist) => {
    dispatch({ type: ActionTypes.SET_WATCHLIST, payload: watchlist });
  };

  const setGenres = (genres) => {
    dispatch({ type: ActionTypes.SET_GENRES, payload: genres });
  };

  const addToWatchlist = (movie) => {
    dispatch({ type: ActionTypes.ADD_TO_WATCHLIST, payload: movie });
  };

  const removeFromWatchlist = (movieId) => {
    dispatch({ type: ActionTypes.REMOVE_FROM_WATCHLIST, payload: movieId });
  };

  const setCurrentAnalysis = (analysis) => {
    dispatch({ type: ActionTypes.SET_CURRENT_ANALYSIS, payload: analysis });
  };

  const clearRecommendations = () => {
    dispatch({ type: ActionTypes.CLEAR_RECOMMENDATIONS });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setRecommendations,
    setWatchlist,
    setGenres,
    addToWatchlist,
    removeFromWatchlist,
    setCurrentAnalysis,
    clearRecommendations,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

// Custom hook to use the context
export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};

export default MovieContext;
