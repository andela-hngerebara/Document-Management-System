import {
  FETCH_USERS_SUCCESS,
  DELETE_USER_SUCCESS,
  SEARCH_USERS_SUCCESS,
  CLEAR_SEARCH,
  GET_USER_SUCCESS
} from './UsersActionTypes';

const initialState = {
  users: [],
  user: null,
  isSearching: false,
  pagination: {},
  searchPagination: {},
  searchUsers: [],
  currentUser: {},
  searchQuery: ''
};


/**
 * @export
 * @param [state=initialState]
 * @param action
 * @returns
 */
export default function UsersReducer(state = initialState, action) {
  let indexOfUser = 0;
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      const { users, pagination } = action.data;
      return {
        ...state,
        users,
        pagination
      };

    case SEARCH_USERS_SUCCESS:
      const { searchUsers, searchPagination } = action.data;
      return {
        ...state,
        searchUsers,
        searchPagination,
        isSearching: true,
        searchQuery: action.searchQuery
      };

    case CLEAR_SEARCH:
      return {
        ...state,
        searchUsers: [],
        searchPagination: {},
        isSearching: false
      };

    case DELETE_USER_SUCCESS: {
      indexOfUser = state.users.findIndex(user =>
        user.id === action.userId);
      return {
        user: undefined,
        users: [
          ...state.users.slice(0, indexOfUser),
          ...state.users.slice(indexOfUser + 1)
        ]
      };
    }

    case GET_USER_SUCCESS: {
      return {
        ...state,
        user: action.data
      };
    }

    default:
      return state;
  }
}
