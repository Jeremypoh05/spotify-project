//Zustand offers state merging by default, simplifying the developer experience and making code less noisy. 
//It's also less opinionated, allowing developers to adapt it to their preferred way of working with React.

import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  doOpen: () => void;
  doClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false, //set default modal to close
  doOpen: () => set({ isOpen: true }),
  doClose: () => set({ isOpen: false }),
}));

export default useAuthModal;