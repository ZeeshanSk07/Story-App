import React, { useEffect, useState } from "react";
import { fetchUserStories, getUserIdFromToken } from "../../apis/story";
import { useSelector } from "react-redux";
import StoryCard from "./StoryCard/StoryCard";
import "./Stories/Stories.css";

const UserStories = () => {
  const [userStories, setUserStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        const userId = await getUserIdFromToken();
        if (!userId) {
          return;
        }
        if (userId) {
          setUserId(true);
        }
        const fetchUser = await fetchUserStories(userId);
        setUserStories(fetchUser.stories);
      } catch (error) {
        console.error("error fetching", error);
      }
    };
    fetchUserStory();
  }, []);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevStories) => prevStories + 4);
  };

  useEffect(() => {
    if (userStories.length > visibleStoriesCount) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [userStories.length, visibleStoriesCount]);
  return (
    <div>
      {userStories.length > 0 ? (
        <>
          {userId && userStories && !isSmallScreen && (
            <div className="story_main_card">
              <div className="category_card_main">
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
                    <h2>Your Stories</h2>
                  </div>
                  <div
                    className={`story__cards ${
                      isSmallScreen ? "small-screen" : "large-screen"
                    }`}
                  >
                    {userStories
                      .slice(0, visibleStoriesCount)
                      .map((userStory, index) => (
                        <StoryCard
                          key={index}
                          story={userStory}
                          isUserStory={true}
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
      ) : (
        <>
          <h2 style={{display: "flex", justifyContent: "center"}}>No User Stories Available</h2>
        </>
      )}
    </div>
  );
};

export default UserStories;
