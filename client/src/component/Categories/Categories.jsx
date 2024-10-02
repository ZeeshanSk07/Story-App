import React, { useState } from "react";
import { Filters } from "../../utils/FIlters";
import { useSelector } from "react-redux";
import { useEditableContext } from "../contexts/EditableContext";

const Categories = () => {
  const { setSelectedCategory } = useEditableContext();
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = (filterId) => {
    setSelectedCategory(filterId);
    setActiveFilter(filterId);
  };

  return (
    <div
      className={
        isSmallScreen ? "filter__sub__main__mobile" : "filter__sub__main"
      }
    >
      {Filters.map((filter, index) => (
        <div
          className={isSmallScreen ? "filter__mobile" : "filter"}
          key={index}
          onClick={() => handleFilterClick(filter.id)}
          style={{
            border: activeFilter === filter.id ? "5px solid skyblue" : "none",
            borderRadius: "18px",
          }}
        >
          <img src={filter.background} alt={filter.name} loading="lazy"/>
          <h1>{filter.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default Categories;
