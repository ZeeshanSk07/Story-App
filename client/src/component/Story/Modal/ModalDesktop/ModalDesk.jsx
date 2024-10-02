import React, { useEffect, useState } from "react";
import "./ModalDesk.css";
import {
  bookmark,
  getUserIdFromToken,
  like,
  viewStoryByUserId,
} from "../../../../apis/story";
import toast from "react-hot-toast";
import { useEditableContext } from "../../../contexts/EditableContext";
import previous from "../../../../assets/previous.png";
import next from "../../../../assets/next.png";
import share from "../../../../assets/share.png";
import cross from "../../../../assets/cross.png";
import ProgressBar from "../../ProgressBar/ProgressBar";

const ModalDesk = ({ story, onClose }) => {
  const { slides = [], _id } = story || {};  // Ensure slides is always an array
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const { setErrorState, setModal } = useEditableContext();

  const userId = getUserIdFromToken();

  // Fetch bookmark and likes data when story and userId are available
  useEffect(() => {
    const fetchBookmarkAndLikesData = async () => {
      if (_id && userId) {  // Safely check for story ID and user ID inside the function
        try {
          const { bookmarked, liked, totalLikes } = await viewStoryByUserId(_id, userId);
          setIsBookmarked(bookmarked);
          setIsLiked(liked);
          setTotalLikes(totalLikes);
        } catch (error) {
          console.error("Error fetching bookmark and likes data", error);
        }
      }
    };

    fetchBookmarkAndLikesData(); // Always call the function
  }, [_id, userId]); // Depend on _id and userId

  const handleBookmark = async () => {
    if (!userId) {
      setErrorState(true);
      setModal(false);
      return;
    }

    const newBookmarkedStatus = !isBookmarked;
    setIsBookmarked(newBookmarkedStatus);

    try {
      await bookmark(story?._id);
    } catch (error) {
      setIsBookmarked(!newBookmarkedStatus); // Revert if API fails
      console.error(error);
    }
  };

  const handleLiked = async () => {
    if (!userId) {
      setErrorState(true);
      setModal(false);
      return;
    }

    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    setTotalLikes((prev) => prev + (newLikedStatus ? 1 : -1));

    try {
      await like(story?._id);
    } catch (error) {
      setIsLiked(!newLikedStatus); // Revert if API fails
      setTotalLikes((prev) => prev - (newLikedStatus ? 1 : -1)); // Revert total likes
      console.error(error);
    }
  };

  // Handle slide navigation
  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleView = async () => {
    try {
      const storyURL = `${window.location.origin}/view/${story._id}`;
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link copied to clipboard", {
        style: {
          position: "relative",
          top: "10rem",
          color: "red",
          fontSize: "1.5rem",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {  // Only run if slides is non-empty
      const intervalId = setInterval(() => {
        setCurrentSlideIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [slides]);

  // Ensure the component still renders, but only display the content if story and slides are valid
  if (!story || slides.length === 0) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <div className="back">
            <img src={previous} alt="Back" onClick={goToPreviousSlide} />
          </div>
          <div className="slide__desk">
            <ProgressBar slides={slides.length} iteration={currentSlideIndex} />
            <div className="story__top">
              <img
                className="story__cross"
                src={cross}
                alt="multiply"
                onClick={onClose}
              />
              <img
                className="story__share__desk"
                src={share}
                alt="share"
                onClick={handleView}
              />
            </div>
            <div className="image-overlay" />
            <img
              src={slides[currentSlideIndex]?.imageUrl}
              alt={`Slide ${currentSlideIndex + 1}`}
              className="main__image"
            />
            <div className="slide__content">
              <h2>{slides[currentSlideIndex]?.title}</h2>
              <p>{slides[currentSlideIndex]?.description}</p>
            </div>
            <div className="story__bottom__mobile">
              <img
                className="story__bookmark"
                src={
                  isBookmarked
                    ? "https://img.icons8.com/ios-filled/50/228BE6/bookmark-ribbon.png"
                    : "https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
                }
                alt="bookmark-ribbon"
                onClick={handleBookmark}
              />
              <img
                className="story__liked__desk"
                src={
                  isLiked
                    ? "https://img.icons8.com/ios-filled/50/FF0000/like--v1.png"
                    : "https://img.icons8.com/ios-filled/50/FFFFFF/like--v1.png"
                }
                alt="like--v1"
                onClick={handleLiked}
              />
            </div>
          </div>
          <div className="next">
            <img src={next} alt="Forward" onClick={goToNextSlide} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDesk;
