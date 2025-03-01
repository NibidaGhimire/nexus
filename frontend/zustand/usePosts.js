import { create } from "zustand";

const usePosts = create((set) => ({
  selectedPost: null,
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  postsList: [],
  setPostsList: (postsList) => set({ postsList }),
}));

export default usePosts;
