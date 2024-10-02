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
  if (!story) {
    return null;
  }

  const { slides, _id } = story;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const { setModal, setErrorState } = useEditableContext();

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!story) return;
    const fetchBookmarkAndLikesData = async () => {
      try {
        if (!userId) {
          console.error("User is not authenticated");
          return;
        }
        const { bookmarked, liked, totalLikes } = await viewStoryByUserId(
          _id,
          userId
        );
        setIsBookmarked(bookmarked);
        setIsLiked(liked);
        setTotalLikes(totalLikes);
      } catch (error) {
        console.error("error fetching bookmark and likes data", error);
      }
    };
    fetchBookmarkAndLikesData();
  }, [_id]);

  const handleBookmark = async () => {
    if (userId) {
      const newBookmarkedStatus = !isBookmarked;
      setIsBookmarked(newBookmarkedStatus);

      try {
        await bookmark(story?._id);
        // Optionally, you can fetch the updated data here
      } catch (error) {
        setIsBookmarked(!newBookmarkedStatus); // Revert if API fails
        console.error(error);
      }
    } else {
      setErrorState(true);
      setModal(false);
    }
  };

  const handleLiked = async () => {
    if (userId) {
      const newLikedStatus = !isLiked;
      setIsLiked(newLikedStatus);
      setTotalLikes((prev) => prev + (newLikedStatus ? 1 : -1));

      try {
        await like(story?._id);
        // Optionally, fetch the updated data here
      } catch (error) {
        setIsLiked(!newLikedStatus); // Revert if API fails
        setTotalLikes((prev) => prev - (newLikedStatus ? 1 : -1)); // Revert total likes
        console.error(error);
      }
    } else {
      setErrorState(true);
      setModal(false);
    }
  };

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
      toast.success("Link Copied to clipboard", {
        style: { position: "relative", top: "10rem", color: "red", fontSize: "1.5rem" }
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="modal-overlay">
        <div className="slide">
          <div>
            <ProgressBar slides={slides.length} iteration={currentSlideIndex} />
          </div>
          <div className="story__top">
            <img
              className="story__cross"
              src={cross}
              alt="multiply"
              onClick={onClose}
            />{" "}
            <img
              className="story__share"
              src={share}
              alt="share"
              onClick={handleView}
            />
          </div>
          <div className="prev1" onClick={goToPreviousSlide}></div>
          <div className="image-overlay" />
          <img
            src={slides[currentSlideIndex].imageUrl}
            alt={`Slide ${currentSlideIndex + 1}`}
            className="main__image"
          />
          <div className="next1" onClick={goToNextSlide}></div>
          <div className="slide__content">
            <h2>{slides[currentSlideIndex].title}</h2>
            <p>{slides[currentSlideIndex].description}</p>
          </div>
          <div className="story__bottom">
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
              className="story__liked"
              src={
                isLiked
                  ? "https://img.icons8.com/ios-filled/50/FF0000/like--v1.png"
                  : "https://img.icons8.com/ios-filled/50/FFFFFF/like--v1.png"
              }
              alt="like--v1"
              onClick={handleLiked}
            />
            {/* <p>{story.totalLikes}</p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalMobile;
