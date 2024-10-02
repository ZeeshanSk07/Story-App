import React, { Suspense, lazy } from "react";
import Loader from "../../utils/Loader";

const Form = lazy(() => import("../../component/Form/Form"));
const Stories = lazy(() => import("../../component/Story/Stories/Stories"));
const Categories = lazy(() => import("../../component/Categories/Categories"));

const Homepage = () => {
  return (
    <>
      <Suspense
        fallback={
          <div>
            <Loader />
          </div>
        }
      >
        <Form />
        <Categories />
        <Stories />
      </Suspense>
    </>
  );
};

export default Homepage;
