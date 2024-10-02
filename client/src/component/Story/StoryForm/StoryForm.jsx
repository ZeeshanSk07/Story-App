import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../../../utils/constants";
import "./StoryForm.css";

const StoryForm = ({ initialSlide, slide, slideIndex, handleChange }) => {
  const [slides, setSlides] = useState(initialSlide);
  useEffect(() => {
    setSlides(initialSlide);
  }, [initialSlide]);
  return (
    <div className="slideForm">
      <div className="slideForm__content">
        <div className="input_container">
          <label className="slideForm__label">Title</label>
          <input
            className="slideForm__input"
            type="text"
            name={`title`}
            value={slide?.title}
            placeholder="Your heading"
            onChange={(e) => handleChange(e, slideIndex)}
          />
        </div>

        <div className="input_container">
          <label className="slideForm__label">Description</label>
          <input
            className="desc__input"
            type="text"
            name={`description`}
            value={slide?.description}
            placeholder="Story Description"
            onChange={(e) => handleChange(e, slideIndex)}
          />
        </div>

        <div className="input_container">
          <label className="slideForm__label">Image Url</label>
          <input
            className="slideForm__input"
            type="text"
            name={`imageUrl`}
            value={slide?.imageUrl}
            placeholder="Add Image Url"
            onChange={(e) => handleChange(e, slideIndex)}
          />
        </div>

        <div className="input_container">
          <label className="slideForm__label">Category</label>
          <select
            name="category"
            id=""
            className="slideForm__input"
            value={slide?.category}
            onChange={(e) => handleChange(e, slideIndex)}
          >
            <option value="" disabled style={{ color: "#847c7c" }}>
              Select category
            </option>
            {CATEGORIES.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StoryForm;
