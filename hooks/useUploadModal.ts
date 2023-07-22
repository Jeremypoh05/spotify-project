import { create } from 'zustand';

interface UploadModalStore {
    isOpen: boolean;
    doOpen: () => void;
    doClose: () => void;
}

const useUploadModal = create<UploadModalStore>((set) => ({
    isOpen: false,
    doOpen: () => set({ isOpen: true }),
    doClose: () => set({ isOpen: false }),
}));

export default useUploadModal;