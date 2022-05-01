export type ViewMode = 'view' | 'edit' | 'developer';

export interface UserObject {
  token: string | null;
}

export const initUser = (): UserObject => ({
  token: localStorage.getItem('user'),
})

export const initViewMode = (): ViewMode => (
  localStorage.getItem('developer') as ViewMode || 'view'
)