import React, { useEffect, useState } from "react";
import { fetchUserStories, getUserIdFromToken } from "../../apis/story";
import "./Stories/Stories.css";
import StoryCard from "./StoryCard/StoryCard";
import Form from "../Form/Form";
import { useSelector } from "react-redux";

const YourStoryMob = () => {
  const [userStories, setUserStories] = useState("");
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const userId = getUserIdFromToken();
  const { isSmallScreen } = useSelector((state) => state.layout);


  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        if (!userId) {
          console.log("user is not authenticated");
        }
        const fetchUser = await fetchUserStories(userId);
        setUserStories(fetchUser.stories);
      } catch (error) {
        console.error("error fetching user stories", error);
      }
    };
    fetchUserStory();
  }, []);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 4);
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
      <Form />
      {userStories.length > 0 ? (
        <>
          {userId && userStories && isSmallScreen && (
            <div className="story__main__card">
              <div className="category__card__main">
                <div className={"category__card__mobile"}>
                  <h2>Your Stories</h2>
                  <div className={`story__cards ${"small-screen"}`}>
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
          <h2 style={{ display: "flex", justifyContent: "center" }}>
            No User Stories Available
          </h2>
        </>
      )}
    </div>
  );
};

export default YourStoryMob;
