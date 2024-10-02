import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = "";

const token = localStorage.getItem("token");

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  }
  return null;
};

export const createStory = async (slidesData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/create`,
      { slides: slidesData },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.Story.slides;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    } else {
      console.error(error);
      throw new Error("An error occurred while registering.");
    }
  }
};

export const fetchStory = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get?category=all`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.stories;
  } catch (error) {
    console.error(error);
  }
};

export const fetchStoryByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get?category=${category}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.stories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchUserStories = async (userId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getAllBookmarks = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/getBookmarks`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const bookmark = async (slideId) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/bookmark/${slideId}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const like = async (slideId) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/like/${slideId}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const viewStoryByUserId = async (slideId, userId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get/${slideId}?userId=${userId}`
    );

    return response.data;
  } catch (error) {
    console.error("error fetching stories", error);
    throw error;
  }
};

export const viewStory = async (slideId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get/${slideId}`
    );

    return response.data;
  } catch (error) {
    console.error("error fetching stories", error);
    throw error;
  }
};

export const getStoryById = async (slideId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get/${slideId}`
    );
    return response.data.story;
  } catch (error) {
    console.error("error fetching stories by Id", error);
  }
};

export const editStory = async (storyId, slides) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/v1/stories/edit/${storyId}`,
      { slides: slides },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Editing Stories", error);
  }
};
