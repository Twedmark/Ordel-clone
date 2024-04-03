import "./App.css";
import Home from "./pages/Home";
import { createContext, useEffect, useReducer, useState, useRef } from "react";
import { gameStateReducer, initialState } from "./reducers/gameStateReducer";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// i want to look for a cookie and if it exists and have the same round number as the server, then i want to use that cookie

export const GameContext = createContext();
export const RowContext = createContext();
export const ActiveRowContext = createContext();

function App() {
  const abortControllerRef = useRef(null);
  const [error, setError] = useState(false);
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
    const fetchServerData = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const serverData = fetch(BASE_URL + "api/word", {
        signal: abortControllerRef.current.signal,
      })
        .then((res) => res.json())
        .catch((error) => {
          if (error.name === "AbortError") return;
          console.log("Error fetching server data:", error);
          setError(true);
        });

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

        let gameOverStatus;

        switch (localStorageData.pastGuesses) {
          case 0:
            gameOverStatus = false;
            break;
          case 5:
            gameOverStatus = true;
            break;
          default:
            gameOverStatus = !localStorageData.pastGuesses[
              localStorageData.pastGuesses.length - 1
            ].result.includes("-" || "W");
        }

        setGameStatus({
          activeRow: localStorageData.pastGuesses.length,
          gameOver: gameOverStatus,
        });
      } else {
        const newState = {
          ...initialState,
          round: serverData.roundNumber,
        };
        localStorage.setItem("gameState", JSON.stringify(newState));
        dispatch({ type: "INITIALIZE_GAME", payload: newState });
      }
      setIsInitialized(true);
    };

    fetchServerData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState, isInitialized]);

  if (error) {
    return <h1>Error fetching data please try again</h1>;
  }

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      <RowContext.Provider value={{ rows, setRows }}>
        <ActiveRowContext.Provider value={{ gameStatus, setGameStatus }}>
          <div className="App">
            <Home loading={isInitialized} />
          </div>
        </ActiveRowContext.Provider>
      </RowContext.Provider>
    </GameContext.Provider>
  );
}

export default App;
