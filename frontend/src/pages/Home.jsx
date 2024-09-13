import React from "react";
import Gameboard from "../components/Gameboard/Gameboard";
import Keyboard from "../components/Keyboard/Keyboard";

const Home = ({ loading, setShowModal }) => {
  return (
    <section className="fullGame">
      <Gameboard loading={loading} setShowModal={setShowModal} />
      <Keyboard setShowModal={setShowModal} />
    </section>
  );
};

export default Home;
