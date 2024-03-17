import { FeaturedAssistant } from "@/lib/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeaturedState {
  featured: FeaturedAssistant[];
}

const initialState: FeaturedState = {
  featured: [
    {
      id: 1,
      title: "Study Buddy",
      description:
        "Try NoCodeBot.ai’s personalised study assistant, simplifies your learning journey. It customises study sessions.",
      imgSrc: "/assets/study.png",
    },
    {
      id: 2,
      title: "Research Helper",
      description:
        "Enhance your research with our dedicated assistant, designed to streamline and support your projects.",
      imgSrc: "/assets/study.png",
    },
    {
      id: 3,
      title: "Exam Prep",
      description:
        "Get ready for exams with tailored revision strategies and support, making sure you're fully prepared.",
      imgSrc: "/assets/study.png",
    },
  ],
};

const featuredSlice = createSlice({
  name: "featured",
  initialState,
  reducers: {
    addFeaturedAssistant: (state, action: PayloadAction<FeaturedAssistant>) => {
      state.featured.push(action.payload);
    },
    removeFeaturedAssistant: (state, action: PayloadAction<number>) => {
      state.featured = state.featured.filter(
        (featured) => featured.id !== action.payload
      );
    },
    updateFeaturedAssistant: (
      state,
      action: PayloadAction<FeaturedAssistant>
    ) => {
      const index = state.featured.findIndex(
        (featured) => featured.id === action.payload.id
      );
      if (index !== -1) {
        state.featured[index] = action.payload;
      }
    },
  },
});

export const {
  addFeaturedAssistant,
  removeFeaturedAssistant,
  updateFeaturedAssistant,
} = featuredSlice.actions;

export default featuredSlice.reducer;
