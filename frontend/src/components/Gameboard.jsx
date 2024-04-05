import React, { useState, useEffect, useContext } from "react";
import { RowContext, GameContext, ActiveRowContext } from "../App";
import "./Gameboard.css";
import useKeyPress from "../hooks/useKeyPress";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Gameboard({ loading }) {
  const { rows, setRows } = useContext(RowContext);
  const { gameState, dispatch } = useContext(GameContext);
  const { gameStatus, setGameStatus } = useContext(ActiveRowContext);
  // used to shake the active row, if the input is wrong in some way
  const [animate, setAnimate] = useState(false);

  useKeyPress(
    rows,
    gameStatus,
    loading,
    setAnimate,
    setRows,
    dispatch,
    setGameStatus,
    BASE_URL,
    animate
  );

  useEffect(() => {
    const updateCurrentGuess = () => {
      dispatch({
        type: "UPDATE_CURRENT_GUESS",
        payload: rows[gameStatus.activeRow].board,
      });
    };

    if (!loading) updateCurrentGuess();
  }, [rows, gameStatus, dispatch, loading]);

  return (
    <section className="mainGrid">
      <section className="center">
        <div className="tiles">
          {Object.keys(rows).map((row, index) => {
            return makeRow(
              rows[row].board,
              rows[row].result,
              animate,
              gameStatus.activeRow === index,
              gameStatus.activeRow,
              gameStatus.gameOver,
              index,
              loading
            );
          })}
        </div>
      </section>
    </section>
  );
}

const makeRow = (
  row,
  result,
  animate,
  isActiveRow,
  activeRow,
  gameOver,
  index,
  loading
) => {
  /// TODO - ADD LOADING "STATE" SO YOU CANT TYPE AND SEND REQUESTS WHILE GETTING THE RIGHT ROUND

  //Generate HTML based on the response from the backend and the current state
  let tiles = [];
  let activeSquare = true;
  for (let i = 0; i < 5; i++) {
    const isCorrect = result[i] === "C";
    const wrongPlace = result[i] === "W";

    let className = "tile";
    if (isActiveRow) {
      className += " active";
    }
    if (isActiveRow && row[i] === "" && activeSquare && !gameOver && !loading) {
      activeSquare = false;
      className += " activeSquare";
    }

    if (animate) {
      className += " animate";
    }
    if (isCorrect) {
      className += " correct";
    }
    if (wrongPlace && !isCorrect) {
      className += " wrongPlace";
    }
    if (!isCorrect && !wrongPlace && index < activeRow) {
      className += " wrong";
    }

    const animationDelay = `${(index * 5 + i) * 0.05}s`;
    const style = {
      "--animation-delay": animationDelay,
    };

    tiles.push(
      <div key={i} className={className} style={style}>
        <span>{row[i]}</span>
      </div>
    );
  }

  return tiles;
};

export default Gameboard;
