import React, { useState, useEffect, useContext } from "react";
import { GameContext, RowContext } from "../App";

import "./Gameboard.css";

function Gameboard() {
  const { word, triedLetters, LettersInRightPlace } = useContext(GameContext);
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

          const allowedGuess = await fetch(
            `http://localhost:3001/api/allowedWord/${guess}`
          ).then((res) => {
            return res.json();
          });

          if (!allowedGuess.success) {
            setAnimate(true);
            console.log("The word is not allowed!");
            return;
          }

          for (let i = 0; i < 5; i++) {
            if (row[i].toUpperCase() === word[i].toUpperCase()) {
              if (!LettersInRightPlace.includes(row[i])) {
                LettersInRightPlace.push(row[i].toUpperCase());
              }
            } else if (!triedLetters.includes(row[i])) {
              triedLetters.push(row[i].toUpperCase());
            }
          }
          setActiveRow((prevRow) => (prevRow < 6 ? prevRow + 1 : prevRow));
          // looks if it's the right word
          if (guess === word) {
            setRoundOver(true);
            // window.alert("Rätt!!");
            console.log("Rätt!!");
            return;
          }

          if (activeRow === 5 && guess !== word) {
            window.alert("Sorry that was wrong, the right word was: " + word);
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
    word,
    triedLetters,
    LettersInRightPlace,
    setActiveRow,
  ]);

  return (
    <section className="mainGrid">
      <section className="center">
        <div className="tiles">
          {rows.map((row, index) => {
            return makeRow(
              row,
              word,
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

const makeRow = (row, word, animate, isActiveRow, activeRow, index) => {
  let isCorrectArray = [];
  let wrongPlaceArray = [];
  let tempWord = word;

  // Loop 1: Check if each character is correct or in the wrong place
  if (!isActiveRow) {
    for (let i = 0; i < 5; i++) {
      const isCorrect = row[i] === word[i];
      isCorrectArray.push(isCorrect);

      if (isCorrect) {
        tempWord = tempWord.replace(row[i], " ");
      }
    }
    // loop 1.5: Check if the character is in the wrong place
    for (let i = 0; i < 5; i++) {
      const wrongPlace =
        tempWord.includes(row[i]) && row[i] !== "" && !isCorrectArray[i];
      wrongPlaceArray.push(wrongPlace);
      // remove the character from the tempWord so it doesn't get counted twice
      if (wrongPlace) {
        tempWord = tempWord.replace(row[i], " ");
      }
    }
  }

  // Loop 2: Generate HTML based on the checks
  let tiles = [];
  for (let i = 0; i < 5; i++) {
    tiles.push(
      <div
        key={i}
        className={`tile ${isCorrectArray[i] && !isActiveRow ? "correct" : ""}${
          wrongPlaceArray[i] && !isCorrectArray[i] && !isActiveRow
            ? "wrongPlace"
            : ""
        }${isActiveRow ? "active" : ""}${
          animate && isActiveRow ? " animate" : ""
        }${
          index < activeRow &&
          !isActiveRow &&
          !isCorrectArray[i] &&
          !wrongPlaceArray[i]
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
