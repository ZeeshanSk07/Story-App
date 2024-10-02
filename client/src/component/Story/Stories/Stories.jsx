import React, { useEffect, useState } from "react";
import "./Stories.css";
import { fetchStoryByCategory } from "../../../apis/story";
import StoryCard from "../StoryCard/StoryCard";
import { useSelector } from "react-redux";
import { useEditableContext } from "../../contexts/EditableContext";
import UserStories from "../UserStories";
import AllCategoryStories from "../AllCategoryStories";
import Loader from "../../../utils/Loader";
import Shimmer from "../Shimmer/Shimmer";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { selectedCategory } = useEditableContext();

  const { isSmallScreen } = useSelector((state) => state.layout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(selectedCategory);
        if (Array.isArray(fetchedStories)) {
          setStories(fetchedStories);
        } else {
          console.log(
            "Error: Invalid data format returned from API",
            fetchedStories
          );
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    if (stories.length > visibleStoriesCount) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [stories.length, visibleStoriesCount]);

  if (stories.length === 0 && selectedCategory !== "all") {
    return (
      <div className="stories_shimmer">
        {[...Array(4)].map((_, index) => (
          <Shimmer key={index} />
        ))}
      </div>
    )
  }

  return (
    <>
      {!isSmallScreen && selectedCategory === "all" && (
        <UserStories />
      )}
      {selectedCategory === "all" && <AllCategoryStories />}
      {selectedCategory !== "all" && (
        <div className="story_main_card">
          <div className="category_card_main">
            <div
              className={
                isSmallScreen ? "category_card__mobile" : "category_card"
              }
            >
              <h2>Top Stories from {selectedCategory}</h2>
              <div
                className={`story__cards ${isSmallScreen ? "small-screen" : "large-screen"
                  }`}
              >
                {stories.slice(0, visibleStoriesCount)?.map((story, index) => (
                  <StoryCard
                    key={index}
                    className="story__card"
                    story={story}
                  />
                ))}
              </div>
              <div className="see-more-btn">
                {showMoreBtn && (
                  <button onClick={handleShowMoreBtn}> See More</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
