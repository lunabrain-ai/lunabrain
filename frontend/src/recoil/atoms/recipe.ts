import {atom, selector} from 'recoil';

export interface RecipeState {
  invalidated: boolean;
}

export const recipeViewerState = atom<RecipeState>({
  key: 'Recipe',
  default: {
    invalidated: false,
  },
})

export const recipeInvalidatedState = selector({
  key: 'recipeInvalidatedState',
  get: ({ get }) => {
    return get(recipeViewerState).invalidated;
  }
});
