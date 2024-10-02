import React, { useEffect, useState } from "react";
import "./ModalMobile.css";
import "../../ProgressBar/ProgressBar.css";
import {
  bookmark,
  getUserIdFromToken,
  like,
  viewStoryByUserId,
} from "../../../../apis/story";
import toast from "react-hot-toast";
import share from "../../../../assets/share.png";
import cross from "../../../../assets/cross.png";
import { useEditableContext } from "../../../contexts/EditableContext";
import ProgressBar from "../../ProgressBar/ProgressBar";

const ModalMobile = ({ story, onClose }) => {
  const { slides = [], _id } = story || {}; // Default values to avoid destructuring issues
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const { setModal, setErrorState } = useEditableContext();

  const userId = getUserIdFromToken();

  // Ensure the useEffect is called unconditionally
  useEffect(() => {
    if (!_id || !userId) return; // Place the conditional check inside the hook
    const fetchBookmarkAndLikesData = async () => {
      try {
        const { bookmarked, liked, totalLikes } = await viewStoryByUserId(_id, userId);
        setIsBookmarked(bookmarked);
        setIsLiked(liked);
        setTotalLikes(totalLikes);
      } catch (error) {
        console.error("Error fetching bookmark and likes data", error);
      }
    };
    fetchBookmarkAndLikesData();
  }, [_id, userId]); // Ensure the hook is called on every render, but the logic runs only if data is available

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (!userId) {
      setErrorState(true);
      setModal(false);
      return;
    }

    const newBookmarkedStatus = !isBookmarked;
    setIsBookmarked(newBookmarkedStatus);

    try {
      await bookmark(story._id);
    } catch (error) {
      setIsBookmarked(!newBookmarkedStatus); // Revert if API fails
      console.error("Error bookmarking", error);
    }
  };

  // Handle like toggle
  const handleLiked = async () => {
    if (!userId) {
      setErrorState(true);
      setModal(false);
      return;
    }

    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    setTotalLikes(prev => prev + (newLikedStatus ? 1 : -1));

    try {
      await like(story._id);
    } catch (error) {
      setIsLiked(!newLikedStatus); // Revert if API fails
      setTotalLikes(prev => prev - (newLikedStatus ? 1 : -1)); // Revert total likes
      console.error("Error liking story", error);
    }
  };

  // Slide navigation logic
  const goToPreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex(prevIndex => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  // Handle sharing the link
  const handleView = async () => {
    try {
      const storyURL = `${window.location.origin}/view/${story._id}`;
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link copied to clipboard", {
        style: { position: "relative", top: "10rem", color: "red", fontSize: "1.5rem" }
      });
    } catch (error) {
      console.error("Error copying link", error);
    }
  };

  // Ensure the useEffect is called unconditionally
  useEffect(() => {
    if (slides.length === 0) return; // Place the conditional check inside the hook

    const intervalId = setInterval(() => {
      setCurrentSlideIndex(prevIndex => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [slides.length]); // Ensure the hook is called on every render, but logic only runs if there are slides

  return (
    <div className="modal-overlay">
      <div className="slide">
        <div>
          <ProgressBar slides={slides.length} iteration={currentSlideIndex} />
        </div>
        <div className="story__top">
          <img
            className="story__cross"
            src={cross}
            alt="close"
            onClick={onClose}
          />
          <img
            className="story__share"
            src={share}
            alt="share"
            onClick={handleView}
          />
        </div>
        <div className="prev1" onClick={goToPreviousSlide} />
        <div className="image-overlay" />
        <img
          src={slides[currentSlideIndex]?.imageUrl}
          alt={`Slide ${currentSlideIndex + 1}`}
          className="main__image"
        />
        <div className="next1" onClick={goToNextSlide} />
        <div className="slide__content">
          <h2>{slides[currentSlideIndex]?.title}</h2>
          <p>{slides[currentSlideIndex]?.description}</p>
        </div>
        <div className="story__bottom">
          <img
            className="story__bookmark"
            src={
              isBookmarked
                ? "https://img.icons8.com/ios-filled/50/228BE6/bookmark-ribbon.png"
                : "https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
            }
            alt="bookmark"
            onClick={handleBookmark}
          />
          <img
            className="story__liked"
            src={
              isLiked
                ? "https://img.icons8.com/ios-filled/50/FF0000/like--v1.png"
                : "https://img.icons8.com/ios-filled/50/FFFFFF/like--v1.png"
            }
            alt="like"
            onClick={handleLiked}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalMobile;
