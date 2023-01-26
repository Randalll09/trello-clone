import { atom, selector } from 'recoil';

interface ITodoState {
  [key: string]: string[];
}

export const todoState = atom<ITodoState>({
  key: 'todos',
  default: {
    'To Do': ['study', 'get groceries', 'make dinner'],
    Doing: ['water the plants', 'walk the dog'],
    Done: ['take a nap', 'do laundry'],
  },
});
