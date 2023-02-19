import React from "react";
import Login from "../components/Login";
export default function login() {
  return <Login></Login>;
}

export const getServerSideProps = () => {
  return {
    props: { shouldNavBarBeHidden: true },
  };
};
