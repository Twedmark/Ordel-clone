import React from "react";
import Gameboard from "../components/Gameboard/Gameboard";
import Keyboard from "../components/Keyboard/Keyboard";

const Home = ({ loading }) => {
  return (
    <section className="fullGame">
      <Gameboard loading={loading} />
      <Keyboard />
    </section>
  );
};

export default Home;
