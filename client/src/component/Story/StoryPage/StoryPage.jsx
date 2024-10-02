import React, { useState } from "react";
import { viewStory } from "../../../apis/story";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ModalMobile from "../Modal/ModalMobile/ModalMobile";
import ModalDesk from "../Modal/ModalDesktop/ModalDesk";

const StoryPage = ({ slideId }) => {
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [stories, setStories] = useState("");

  const navigate = useNavigate();

  const toggleModal = () => {
    navigate("/");
  };

  const handleView = async () => {
    const data = await viewStory(slideId);
    setStories(data.story);
  };
  useEffect(() => {
    handleView();
  }, [slideId]);
  return (
    <div>
      {isSmallScreen ? (
        <>
          <ModalMobile story={stories} onClose={toggleModal} />
        </>
      ) : (
        <>
          <ModalDesk story={stories} onClose={toggleModal} />
        </>
      )}
    </div>
  );
};

export default StoryPage;
