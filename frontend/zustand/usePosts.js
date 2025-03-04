import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePosts = create(
  persist(
    (set) => ({
      selectedPost: null,
      setSelectedPost: (selectedPost) => set({ selectedPost }),
      postsList: [],
      setPostsList: (postsList) => set({ postsList }),
      savedPosts: [],
      setSavedPosts: (savedPosts) => set({ savedPosts }),
      comments:[],
      setComments: (comments) => set({comments}),
    }),
    {
      name: "posts-storage", 
    }
  )
);

export default usePosts;
