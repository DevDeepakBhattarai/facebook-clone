import React from "react";
import Navbar from "./Navbar";

export default (WrappedComponent: any) => {
  return ({ ...props }) => {
    if (props.shouldNavBarBeHidden)
      return (
        <>
          <WrappedComponent {...props} />
        </>
      );
    return <WrappedComponent />;
  };
};
