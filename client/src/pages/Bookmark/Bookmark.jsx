import React, { useEffect, useState } from "react";
import { getAllBookmarks } from "../../apis/story";
import StoryCard from "../../component/Story/StoryCard/StoryCard";
import "./Bookmark.css";
import Form from "../../component/Form/Form";
import Shimmer from "../../component/Story/Shimmer/Shimmer";

const Bookmark = () => {
  const [stories, setStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getAllBookmarks();
        setStories(data && data.bookmarks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    if (stories?.length > visibleStoriesCount) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [stories?.length, visibleStoriesCount]);

  return (
    <div>
      <Form />
      {loading ? (
        <div className="bookmark">
          {/* Dynamically generate shimmer UIs equal to the number of expected bookmarks */}
          {[...Array(4)].map((_, index) => (
            <Shimmer key={index} />
          ))}
        </div>
      ) : stories?.length > 0 ? (
        <>
          <h1>Your Bookmarks</h1>
          <div className="bookmark__main">
            <div className="bookmark">
              {stories.slice(0, visibleStoriesCount)?.map((story, index) => (
                <StoryCard key={index} story={story} />
              ))}
            </div>
            <div className="see-more-btn">
              {showMoreBtn && (
                <button onClick={handleShowMoreBtn}> See More</button>
              )}
            </div>
          </div>
        </>
      ) : (
        <h1>No Bookmarks Found</h1>
      )}
    </div>
  );
};

export default Bookmark;
