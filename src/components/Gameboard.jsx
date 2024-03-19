import React, { useState, useEffect, useContext } from "react";
import { RowContext, GameContext, ActiveRowContext } from "../App";
import "./Gameboard.css";

function Gameboard() {
  const { rows, setRows } = useContext(RowContext);
  const { gameState, dispatch } = useContext(GameContext);
  const { gameStatus, setGameStatus } = useContext(ActiveRowContext);
  // used to shake the active row, if the input is wrong in some way
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const updateCurrentGuess = () => {
      console.log("updating current guess");
      dispatch({
        type: "UPDATE_CURRENT_GUESS",
        payload: rows[gameStatus.activeRow].board,
      });
    };
    if (!gameStatus.gameOver) {
      updateCurrentGuess();
    }
  }, [rows, gameStatus, dispatch]);

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
          // looks for empty filed
          if (row.board.includes("")) {
            setAnimate(true);
            console.log("Please fill in all fields!");
            return;
          }

          const response = await fetch(
            `http://localhost:3001/api/allowedWord/${guess}`
          ).then((res) => {
            return res.json();
          });

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

            console.log(response);
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
            console.log("Rätt!!");
            return;
          }

          if (gameStatus.activeRow === 4 && !response.allCorrect) {
            const rightWord = await fetch(
              "http://localhost:3001/api/word"
            ).then((res) => {
              return res.json();
            });

            window.alert(
              "Sorry that was wrong, the right word was: " + rightWord.word
            );
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
              index
            );
          })}
        </div>
      </section>
    </section>
  );
}

const makeRow = (row, result, animate, isActiveRow, activeRow, index) => {
  //Generate HTML based on the response from the backend and the current state
  let tiles = [];
  for (let i = 0; i < 5; i++) {
    const isCorrect = result[i] === "C";
    const wrongPlace = result[i] === "W";

    let className = "tile";
    if (isActiveRow) {
      className += " active";
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

    tiles.push(
      <div key={i} className={className}>
        <span>{row[i]}</span>
      </div>
    );
  }

  return tiles;
};

export default Gameboard;
