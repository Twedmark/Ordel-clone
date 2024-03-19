import React, { useContext, useEffect, useState } from "react";
import { RowContext } from "../App";
import "./Keyboard.css";

function Keyboard() {
  const { rows } = useContext(RowContext);
  const [className, setClassName] = useState({
    Q: "key",
    W: "key",
    E: "key",
    R: "key",
    T: "key",
    Y: "key",
    U: "key",
    I: "key",
    O: "key",
    P: "key",
    Å: "key",
    A: "key",
    S: "key",
    D: "key",
    F: "key",
    G: "key",
    H: "key",
    J: "key",
    K: "key",
    L: "key",
    Ö: "key",
    Ä: "key",
    Z: "key",
    X: "key",
    C: "key",
    V: "key",
    B: "key",
    N: "key",
    M: "key",
  });

  const testingFunction = () => {
    fetch("http://localhost:3001/api/test")
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  useEffect(() => {
    const createClassName = () => {
      Object.keys(rows).forEach((key) => {
        const row = rows[key];
        if (row.result.includes("")) {
          return;
        }
        row.board.forEach((letter) => {
          let isLetterInRightPlace = false;
          let isLetterInWord = false;

          for (let i = 0; i < 5; i++) {
            if (rows[i].board.includes(letter.toUpperCase())) {
              for (let j = 0; j < 5; j++) {
                if (rows[i].board[j] === letter.toUpperCase()) {
                  if (rows[i].result[j] === "C") {
                    isLetterInRightPlace = true;
                  } else if (rows[i].result[j] === "W") {
                    isLetterInWord = true;
                  }
                }
              }
            }
          }

          setClassName((prevClassName) => {
            return {
              ...prevClassName,
              [letter.toUpperCase()]: "key incorrect",
            };
          });

          if (isLetterInWord) {
            setClassName((prevClassName) => {
              return {
                ...prevClassName,
                [letter.toUpperCase()]: "key wrongPlace",
              };
            });
          }
          if (isLetterInRightPlace) {
            setClassName((prevClassName) => {
              return {
                ...prevClassName,
                [letter.toUpperCase()]: "key correct",
              };
            });
          }
        });
      });
    };

    createClassName();
  }, [rows]);

  return (
    <section className="keyboard">
      {className ? (
        <>
          <div className="keys">
            {/* {Array.from("QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM").map((letter, index) =>  swedish keyboard */}
            {Array.from("QWERTYUIOPASDFGHJKLZXCVBNM").map((letter) =>
              createButton(letter, className)
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
        </>
      ) : (
        ""
      )}
    </section>
  );
}

const createButton = (letter, className) => {
  return (
    <button
      style={{
        gridArea: letter,
      }}
      key={letter}
      className={className[letter]}
      onClick={() => {
        handleClickedLetter(letter);
      }}
    >
      {letter}
    </button>
  );
};

const handleClickedLetter = (letter) => {
  const event = new KeyboardEvent("keydown", {
    key: letter,
    code: letter,
    which: letter.charCodeAt(0),
    keyCode: letter.charCodeAt(0),
  });
  document.dispatchEvent(event);
};

export default Keyboard;
