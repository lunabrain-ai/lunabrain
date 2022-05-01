import { ChangeEventHandler } from 'react';

export const inputChangeHandler = (setValue: (value: string) => void): ChangeEventHandler<HTMLInputElement> => {
  return (e) => {
    setValue(e.target.value)
  }
}
