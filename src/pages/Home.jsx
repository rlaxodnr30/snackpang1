import React from "react";
import styled from "styled-components";
import HomePage from "../components/HomePage/HomePage.jsx";
export default function Home({
  setClickSnacks,
  clickSnacks,
  loading,
  setLoading,
  setCartCount,
}) {
  return (
    <HomePage
      setCartCount={setCartCount}
      setClickSnacks={setClickSnacks}
      clickSnacks={clickSnacks}
      loading={loading}
      setLoading={setLoading}
    />
  );
}
