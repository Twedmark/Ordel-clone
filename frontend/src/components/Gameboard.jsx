import React, { useState, useEffect, useContext } from "react";
import { RowContext, GameContext, ActiveRowContext } from "../App";
import "./Gameboard.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Gameboard({ loading }) {
  const { rows, setRows } = useContext(RowContext);
  const { gameState, dispatch } = useContext(GameContext);
  const { gameStatus, setGameStatus } = useContext(ActiveRowContext);
  const [animate, setAnimate] = useState(false);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      document.activeElement.blur();
      setAnimate(false);

      const handleRow = async (row, rowIndex) => {
        // this means that the game is over
        if (gameStatus.activeRow === 5 || gameStatus.gameOver) {
          console.log("The game is over");
          return;
        }
        const emptyIndex = row.board.indexOf("");

        if (
          emptyIndex !== -1 &&
          event.key.length === 1 &&
          event.key.match(/[a-ö]/i)
        ) {
          const newRow = { ...row };
          newRow.board[emptyIndex] = event.key.toUpperCase();
          setRows({ ...rows, [rowIndex]: row });
        } else if (event.key === "Backspace") {
          if (emptyIndex === -1) {
            setRows((prevRows) => {
              const newRows = { ...prevRows };
              newRows[rowIndex].board[4] = "";
              return newRows;
            });
          } else {
            setRows((prevRows) => {
              const newRows = { ...prevRows };
              newRows[rowIndex].board[emptyIndex - 1] = "";
              return newRows;
            });
          }

          setRows({ ...rows, [rowIndex]: row });
        } else if (event.key === "Enter") {
          const guess = row.board.join("").toUpperCase();
          if (row.board.includes("")) {
            setAnimate(true);
            console.log("Please fill in all fields!");
            return;
          }
          setSpin(true);

          const response = await fetch(
            `${BASE_URL}api/allowedWord/${guess}`
          ).then((res) => {
            return res.json();
          });
          setSpin(false);

          if (!response.success) {
            setAnimate(true);
            console.log("The word is not allowed!");
            return;
          } else {
            setRows((prevRows) => {
              const newRows = { ...prevRows };
              newRows[rowIndex].result = response.result;
              dispatch({
                type: "ADD_GUESS",
                payload: { board: row.board, result: response.result },
              });

              return newRows;
            });
          }

          setGameStatus((prevStatus) => {
            return {
              ...prevStatus,
              activeRow:
                prevStatus.activeRow < 6
                  ? prevStatus.activeRow + 1
                  : prevStatus.activeRow,
            };
          });
          // looks if it's the right word
          if (response.allCorrect) {
            setGameStatus((prevStatus) => {
              return { ...prevStatus, gameOver: true };
            });
            // window.alert("Rätt!!");
            const stats = await fetch(
              `${BASE_URL}api/win/${gameStatus.activeRow}`
            ).then((res) => {
              return res.json();
            });
            console.log("Correct word!");
            console.log(stats);
            updateHistory(true, gameState, response, row);
            return;
          } else if (gameStatus.activeRow === 4 && !response.allCorrect) {
            updateHistory(false, gameState, response, row);
            const rightWord = await fetch(BASE_URL + "api/word").then((res) => {
              return res.json();
            });
            const losses = await fetch(`${BASE_URL}api/loss`).then((res) => {
              return res.json();
            });
            console.log(losses);

            window.alert("Sorry that was wrong");
          }
        }
      };
      handleRow(rows[gameStatus.activeRow], gameStatus.activeRow);
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [rows, dispatch, setRows, gameState, gameStatus, setGameStatus]);

  useEffect(() => {
    const updateCurrentGuess = () => {
      if (gameStatus.activeRow === 5) {
        dispatch({
          type: "UPDATE_CURRENT_GUESS",
          payload: ["", "", "", "", ""],
        });
        return;
      } else {
        dispatch({
          type: "UPDATE_CURRENT_GUESS",
          payload: rows[gameStatus.activeRow].board,
        });
      }
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
              spin,
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
  spin,
  isActiveRow,
  activeRow,
  gameOver,
  index,
  loading
) => {
  let tiles = [];
  let activeSquare = true;
  for (let i = 0; i < 5; i++) {
    const isCorrect = result[i] === "C";
    const wrongPlace = result[i] === "W";

    let className = "tile";

    const tilesData = document.querySelectorAll(".tile");

    if (tilesData[index]?.classList.contains("loading")) {
      className += " loading";
    }

    if (isActiveRow) {
      className += " active";
    }
    if (isActiveRow && row[i] === "" && activeSquare && !gameOver && !loading) {
      activeSquare = false;
      className += " activeSquare";
    }
    if (animate && isActiveRow) {
      className += " animate";
    }
    if (spin && isActiveRow) {
      className += " spin";
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

    const animationDelay = `${-1 - (index * 5 + i) * 2.03}s`;
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

const updateHistory = (win, gameState, response, row) => {
  console.log("updateHistory");

  console.log("row", row);
  console.log("response", response);

  const clone = JSON.parse(JSON.stringify(gameState));

  const newGameHistory = {
    RoundNumber: clone.round,
    pastGuesses: clone.pastGuesses,
    result: win ? "W" : "L",
    date: new Date().toLocaleString(),
  };

  newGameHistory.pastGuesses.push({
    board: row.board,
    result: response.result,
  });
  const gameHistory = JSON.parse(localStorage.getItem("GameHistory")) || {
    wins: 0,
    losses: 0,
    previousGames: [],
  };
  if (win) {
    gameHistory.wins += 1;
  } else {
    gameHistory.losses += 1;
  }
  gameHistory.previousGames.push(newGameHistory);
  localStorage.setItem("GameHistory", JSON.stringify(gameHistory));
};

export default Gameboard;
