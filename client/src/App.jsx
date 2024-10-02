import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { EditableProvider } from "./component/contexts/EditableContext.jsx";
import { useSelector } from "react-redux";
import Loader from "./utils/Loader.jsx";
import Shimmer from "./component/Story/Shimmer/Shimmer.jsx";

const Bookmark = lazy(() => import("./pages/Bookmark/Bookmark"));
const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const StoryPage = lazy(() => import("./component/Story/StoryPage/StoryPage"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const YourStoryMob = lazy(() =>
  import("../src/component/Story/YourStoryMob.jsx")
);

function App() {
  const { isSmallScreen } = useSelector((state) => state.layout);

  return (
    <EditableProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Suspense fallback={<Shimmer />} >
          <Routes>

            <Route
              path="/"
              element={
                <Homepage />

              }
            />
            <Route
              path="/bookmarks"
              element={
                <Bookmark />

              }
            />

            {isSmallScreen && (
              <Route
                path="/your-story"
                element={
                  <YourStoryMob />

                }
              />
            )}
            <Route
              path="/view/:slideId"
              element={
                <StoryPageWrapper />

              }
            />
            <Route
              path="*"
              element={
                <NotFound />

              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </EditableProvider>
  );
}

export default App;

const StoryPageWrapper = () => {
  const { slideId } = useParams();
  return <StoryPage slideId={slideId} />;
};
