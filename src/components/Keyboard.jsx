import React, { useContext } from "react";
import { GameContext } from "../App";
import "./Keyboard.css";

function Keyboard() {
  const { triedLetters, lettersInRightPlace, lettersInWrongPlace } =
    useContext(GameContext);

  const handleClickedLetter = (letter) => {
    const event = new KeyboardEvent("keydown", {
      key: letter,
      code: letter,
      which: letter.charCodeAt(0),
      keyCode: letter.charCodeAt(0),
    });
    document.dispatchEvent(event);
  };

  const testingFunction = () => {
    fetch("http://localhost:3001/api/test")
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const createButton = (letter, index) => {
    let isLetterInRightPlace = false;
    let isLetterInWord = false;
    let isLetterTried = false;

    for (let i = 0; i < lettersInRightPlace.length; i++) {
      if (lettersInRightPlace[i] === letter.toUpperCase()) {
        isLetterInRightPlace = true;
      }
    }

    for (let i = 0; i < lettersInWrongPlace.length; i++) {
      if (lettersInWrongPlace[i] === letter.toUpperCase()) {
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
          isLetterInWord && !isLetterInRightPlace ? "WrongPlace" : ""
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
      <button
        onClick={() => {
          testingFunction();
        }}
      >
        Test
      </button>
    </section>
  );
}

export default Keyboard;
