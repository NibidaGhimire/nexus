import { create } from "zustand";

const usePosts = create((set) => ({
  selectedPosts: [],
  setselectedPosts: (selectedPosts) => set({ selectedPosts }),
  postsList: [],
  setPostsList: (postsList) => set({ postsList }),
}));

export default usePosts;
