import React, { useState, useEffect, useContext } from "react";
import { GameContext, RowContext } from "../App";

import "./Gameboard.css";

function Gameboard() {
  const { triedLetters, lettersInWrongPlace, lettersInRightPlace } =
    useContext(GameContext);
  const { activeRow, setActiveRow } = useContext(RowContext);
  const [rows, setRows] = useState([
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
  ]);
  // used to shake the active row, if the input is wrong in some way
  const [animate, setAnimate] = useState(false);
  const [roundOver, setRoundOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      document.activeElement.blur();
      setAnimate(false);

      const handleRow = async (row, rowIndex) => {
        // this means that the game is over
        if (activeRow === 6 || roundOver) {
          console.log("The game is over");
          return;
        }
        const emptyIndex = row.indexOf("");

        if (
          emptyIndex !== -1 &&
          event.key.length === 1 &&
          event.key.match(/[a-ö]/i)
        ) {
          row[emptyIndex] = event.key.toUpperCase();
          setRows((prevRows) => {
            const newRows = [...prevRows];
            newRows[rowIndex] = [...row];
            return newRows;
          });
        } else if (event.key === "Backspace") {
          if (emptyIndex === -1) {
            row[4] = "";
          } else {
            row[emptyIndex - 1] = "";
          }
          setRows((prevRows) => {
            const newRows = [...prevRows];
            newRows[rowIndex] = [...row];
            return newRows;
          });
        } else if (event.key === "Enter") {
          const guess = row.join("").toUpperCase();
          // looks for empty filed
          if (row.includes("")) {
            setAnimate(true);
            console.log("Please fill in all fields!");
            return;
          }

          // TODO: Change name
          const allowedGuess = await fetch(
            `http://localhost:3001/api/allowedWord/${guess}`
          ).then((res) => {
            return res.json();
          });

          if (!allowedGuess.success) {
            setAnimate(true);
            console.log("The word is not allowed!");
            return;
          } else {
            allowedGuess.triedLetters.forEach((letter) => {
              if (!triedLetters.includes(letter)) {
                triedLetters.push(letter);
              }
            });

            allowedGuess.lettersInRightPlace.forEach((letter, index) => {
              lettersInRightPlace[index] = letter;
            });

            allowedGuess.lettersInWrongPlace.forEach((letter, index) => {
              lettersInWrongPlace[index] = letter;
            });
          }

          setActiveRow((prevRow) => (prevRow < 6 ? prevRow + 1 : prevRow));
          // looks if it's the right word
          if (allowedGuess.allCorrect) {
            setRoundOver(true);
            // window.alert("Rätt!!");
            console.log("Rätt!!");
            return;
          }

          if (activeRow === 5 && !allowedGuess.allCorrect) {
            const rightWord = await fetch("http://localhost:3001/api/word");
            window.alert(
              "Sorry that was wrong, the right word was: " + rightWord
            );
          }
        }
      };

      handleRow(rows[activeRow], activeRow);
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    rows,
    activeRow,
    roundOver,
    setRoundOver,
    triedLetters,
    lettersInRightPlace,
    lettersInWrongPlace,
    setActiveRow,
  ]);

  return (
    <section className="mainGrid">
      <section className="center">
        <div className="tiles">
          {rows.map((row, index) => {
            return makeRow(
              row,
              lettersInRightPlace,
              lettersInWrongPlace,
              animate,
              activeRow === index,
              activeRow,
              index
            );
          })}
        </div>
      </section>
    </section>
  );
}

const makeRow = (
  row,
  lettersInRightPlace,
  lettersInWrongPlace,
  animate,
  isActiveRow,
  activeRow,
  index
) => {
  //Generate HTML based on the response from the backend and the current state
  let tiles = [];
  for (let i = 0; i < 5; i++) {
    let isCorrect = lettersInRightPlace[i] === row[i] && row[i] !== "";
    let wrongPlace = lettersInWrongPlace[i] === row[i] && row[i] !== "";

    tiles.push(
      <div
        key={i}
        className={`tile ${isActiveRow ? "active" : ""}${
          animate && isActiveRow ? " animate" : ""
        }
        ${isCorrect && !isActiveRow ? "correct" : ""}
        ${wrongPlace && !isCorrect && !isActiveRow ? "wrongPlace" : ""}
        ${
          !isCorrect && !wrongPlace && index < activeRow && !isActiveRow
            ? "empty"
            : ""
        }`}
      >
        <span>{row[i]}</span>
      </div>
    );
  }

  return tiles;
};

export default Gameboard;
