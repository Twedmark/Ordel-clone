import "./App.css";
import Home from "./pages/Home";
import { createContext, useEffect, useReducer, useState } from "react";
import { gameStateReducer, initialState } from "./reducers/gameStateReducer";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// i want to look for a cookie and if it exists and have the same round number as the server, then i want to use that cookie

export const GameContext = createContext();
export const RowContext = createContext();
export const ActiveRowContext = createContext();

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [rows, setRows] = useState({
    0: {
      board: Array(5).fill(""),
      result: ["", "", "", "", ""],
    },
    1: {
      board: Array(5).fill(""),
      result: ["", "", "", "", ""],
    },
    2: {
      board: Array(5).fill(""),
      result: ["", "", "", "", ""],
    },
    3: {
      board: Array(5).fill(""),
      result: ["", "", "", "", ""],
    },
    4: {
      board: Array(5).fill(""),
      result: ["", "", "", "", ""],
    },
  });
  const [gameStatus, setGameStatus] = useState({
    activeRow: 0,
    gameOver: false,
  });
  const [gameState, dispatch] = useReducer(gameStateReducer, initialState);

  useEffect(() => {
    async function getTodaysWord() {
      await fetch(BASE_URL + "api/word").then((res) => {
        res.json().then((data) => {
          // console.log(data);
        });
      });
    }

    getTodaysWord();
  }, []);

  useEffect(() => {
    const fetchServerData = async () => {
      const serverData = await fetch(BASE_URL + "api/word").then((res) =>
        res.json()
      );

      const localStorageData =
        JSON.parse(localStorage.getItem("gameState")) || initialState;

      if (localStorageData.round === serverData.roundNumber) {
        dispatch({ type: "INITIALIZE_GAME", payload: localStorageData });

        setRows((prevRows) => {
          const newRows = { ...prevRows };

          for (let i = 0; i < localStorageData.pastGuesses.length; i++) {
            newRows[i].board = localStorageData.pastGuesses[i].board;
            newRows[i].result = localStorageData.pastGuesses[i].result;
            if (i === localStorageData.pastGuesses.length - 1 && i !== 4) {
              newRows[i + 1].board = localStorageData.currentGuess;
            }
          }

          if (localStorageData.pastGuesses.length === 0) {
            newRows[0].board = localStorageData.currentGuess;
          }

          return newRows;
        });

        console.log(
          "localStorageData.pastGuesses",
          localStorageData.pastGuesses
        );

        const gameOverBool =
          !localStorageData.pastGuesses.length === 0 ? true : false;
        console.log("GameOverBool", gameOverBool);

        setGameStatus({
          activeRow: localStorageData.pastGuesses.length,
          gameOver:
            !localStorageData.pastGuesses.length === 0
              ? !localStorageData.pastGuesses[
                  localStorageData.pastGuesses.length - 1
                ].result.includes("-" || "W")
                ? true
                : false
              : localStorageData.pastGuesses.length === 5
              ? true
              : false,
        });
      } else {
        const newState = {
          ...initialState,
          round: serverData.roundNumber,
        };
        localStorage.setItem("gameState", JSON.stringify(newState));
        dispatch({ type: "INITIALIZE_GAME", payload: newState });
      }

      console.log("setting isInitialized to true");
      setIsInitialized(true);
    };

    fetchServerData();
  }, []);

  useEffect(() => {
    console.log("isInitialized", isInitialized);
    if (isInitialized) {
      console.log("setting Data");
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState, isInitialized]);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      <RowContext.Provider value={{ rows, setRows }}>
        <ActiveRowContext.Provider value={{ gameStatus, setGameStatus }}>
          <div className="App">{rows ? <Home /> : ""}</div>
        </ActiveRowContext.Provider>
      </RowContext.Provider>
    </GameContext.Provider>
  );
}

export default App;
