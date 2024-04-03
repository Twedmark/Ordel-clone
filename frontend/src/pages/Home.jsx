import React from "react";
import Gameboard from "../components/Gameboard";
import Keyboard from "../components/Keyboard";

const Home = ({ loading }) => {
  return (
    <section className="fullGame">
      <Gameboard loading={loading} />
      <Keyboard />
    </section>
  );
};

export default Home;
