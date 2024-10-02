import { createContext, useContext, useState } from "react";

const EditableContext = createContext();

export const useEditableContext = () => {
  return useContext(EditableContext);
};

export const EditableProvider = ({ children }) => {
  const [editable, setEditable] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const [errorState, setErrorState] = useState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modal, setModal] = useState(true)

  const setEditableState = (state) => {
    setEditable(state);
  };
  const setEditStoryId = (id) => {
    setStoryId(id);
  };
  return (
    <EditableContext.Provider
      value={{
        editable,
        storyId,
        setEditableState,
        setEditStoryId,
        errorState,
        setErrorState,
        modal,
        setModal,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </EditableContext.Provider>
  );
};
