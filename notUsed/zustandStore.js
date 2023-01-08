import create from 'zustand'

const useStore = create((set) => ({
  count: 3,
  increaseCount: () => set((state) => ({ count: state.count + 1 })),
}))

export default useStore;