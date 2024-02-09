import React from "react";
import Gameboard from "../components/Gameboard";
import Keyboard from "../components/Keyboard";

const Home = () => {
  return (
    <section className="fullGame">
      <Gameboard />
      <Keyboard />
    </section>
  );
};

export default Home;
