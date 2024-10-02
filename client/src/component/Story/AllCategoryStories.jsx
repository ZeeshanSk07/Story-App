import React, { useEffect, useState } from "react";
import { fetchStoryByCategory } from "../../apis/story";
import { useSelector } from "react-redux";
import StoryCard from "./StoryCard/StoryCard";
import { useEditableContext } from "../contexts/EditableContext";
import "./Stories/Stories.css";
import Loader from "../../utils/Loader";
import Shimmer from "./Shimmer/Shimmer";

const AllCategoryStories = () => {
  const [stories, setStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState({});
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const { selectedCategory, setSelectedCategory } = useEditableContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(selectedCategory);
        if (typeof fetchedStories === "object" && fetchedStories !== null) {
          setStories(fetchedStories);

          const initialVisibleCount = {};
          Object.keys(fetchedStories).forEach(
            (categoryName) => (initialVisibleCount[categoryName] = 4)
          );
          setVisibleStoriesCount(initialVisibleCount);
        } else {
          console.error(
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

  const handleShowMoreBtn = (categoryName) => {
    setVisibleStoriesCount((prevCount) => ({
      ...prevCount,
      [categoryName]: prevCount[categoryName] + 4,
    }));
  };

  useEffect(() => {
    if (
      Object.values(stories).flatMap((arr) => arr).length > visibleStoriesCount
    ) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [stories, visibleStoriesCount]);

  if (stories.length === 0) {
    return (
      <div className="stories_shimmer">
        {[...Array(4)].map((_, index) => (
          <Shimmer key={index} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {Object.entries(stories).map( //converts the object to array of key - value pairs
        ([categoryName, categoryStories], categoryIndex) => ( //[key, value], index
          <div className="category_card_main" key={categoryIndex}>
            <div
              className={
                isSmallScreen ? "category_card__mobile" : "category_card"
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: " 1rem auto",
                }}
              >
                <h2>Top Stories About {categoryName}</h2>
              </div>
              <div
                className={`story__cards ${isSmallScreen ? "small-screen" : "large-screen"
                  }`}
              >
                {categoryStories
                  .slice(0, visibleStoriesCount[categoryName])
                  .map((story, storyIndex) => (
                    <StoryCard key={storyIndex} story={story} />
                  ))}
              </div>
              <div className="see-more-btn">
                {categoryStories.length > 4 &&
                  visibleStoriesCount[categoryName] <
                  categoryStories.length && (
                    <button onClick={() => handleShowMoreBtn(categoryName)}>
                      See More
                    </button>
                  )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AllCategoryStories;
