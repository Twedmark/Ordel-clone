import React, { useContext, useEffect } from "react";
import { GameContext, RowContext } from "../App";
import "./Keyboard.css";

function Keyboard() {
  const { word, triedLetters, LettersInRightPlace } = useContext(GameContext);
  const { activeRow } = useContext(RowContext);

  const handleClickedLetter = (letter) => {
    const event = new KeyboardEvent("keydown", {
      key: letter,
      code: letter,
      which: letter.charCodeAt(0),
      keyCode: letter.charCodeAt(0),
    });
    document.dispatchEvent(event);
  };

  useEffect(() => {}, [activeRow, triedLetters]);

  const createButton = (letter, index) => {
    let isLetterInRightPlace = false;
    let isLetterInWord = false;
    let isLetterTried = false;

    for (let i = 0; i < LettersInRightPlace.length; i++) {
      if (LettersInRightPlace[i] === letter.toUpperCase()) {
        isLetterInRightPlace = true;
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter.toUpperCase()) {
        isLetterInWord = true;
      }
    }

    for (let i = 0; i < triedLetters.length; i++) {
      if (triedLetters[i] === letter.toUpperCase()) {
        isLetterTried = true;
      }
    }

    return (
      <button
        style={{
          gridArea: letter,
        }}
        key={index}
        className={`key ${isLetterInRightPlace ? "Correct" : ""}${
          isLetterInWord && isLetterTried && !isLetterInRightPlace
            ? "WrongPlace"
            : ""
        }${isLetterTried && !isLetterInWord ? "Incorrect" : ""}`}
        onClick={() => {
          handleClickedLetter(letter);
        }}
      >
        {letter}
      </button>
    );
  };

  return (
    <section className="keyboard">
      <div className="keys">
        {/* {Array.from("QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM").map((letter, index) =>  swedish keyboard */}
        {Array.from("QWERTYUIOPASDFGHJKLZXCVBNM").map((letter, index) =>
          createButton(letter, index)
        )}
        <button
          className="key backSpace"
          onClick={() => {
            handleClickedLetter("Backspace");
          }}
        >
          <i className="material-icons">backspace</i>
        </button>
        <button
          className="key enter"
          onClick={() => {
            handleClickedLetter("Enter");
          }}
        >
          Play
        </button>
      </div>
    </section>
  );
}

export default Keyboard;
