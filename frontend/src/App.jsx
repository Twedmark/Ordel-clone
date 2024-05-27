import "./App.css";
import Home from "./pages/Home";
import Header from "./layout/Header";
import { createContext, useEffect, useReducer, useState, useRef } from "react";
import { gameStateReducer, initialState } from "./reducers/gameStateReducer";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
      console.log("Fetching server data");
      const tiles = document.querySelectorAll(".tile");
      tiles.forEach((tile, index) => {
        tile.classList.add("loading");
      });

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const serverData = await fetch(BASE_URL + "api/word", {
        signal: abortControllerRef.current.signal,
      })
        .then((res) => res.json())
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
            return;
          }
          console.log("Error fetching server data:", error);
          console.log(BASE_URL + "api/word");
          // console.log("Retrying in 5 seconds");
          // setTimeout(() => fetchServerData(), 5000);

          setError(true);
        });

      const localStorageData =
        JSON.parse(localStorage.getItem("gameState")) || initialState;

      console.log("serverData", serverData);

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

        switch (localStorageData.pastGuesses.length) {
          case 0:
            gameOverStatus = false;
            break;
          case 5:
            gameOverStatus = true;
            break;
          default:
            gameOverStatus = !localStorageData.pastGuesses[
              localStorageData.pastGuesses.length - 1
            ].result?.includes("-" || "W");
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

      if (!error) {
        setIsInitialized(true);

        const tiles = document.querySelectorAll(".tile");
        tiles.forEach((tile, index) => {
          setTimeout(() => {
            tile.classList.remove("loading");
            tile.classList.add("loaded");
          }, index * 60);
        });
      } else {
        setIsInitialized(false);
      }
    };

    fetchServerData();
  }, [error]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState, isInitialized]);

  if (error) {
    return (
      <div className="app">
        <h1>Error fetching data please try again</h1>
      </div>
    );
  }

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      <RowContext.Provider value={{ rows, setRows }}>
        <ActiveRowContext.Provider value={{ gameStatus, setGameStatus }}>
          <div className="App">
            <Header />
            <Home loading={!isInitialized} />
          </div>
        </ActiveRowContext.Provider>
      </RowContext.Provider>
    </GameContext.Provider>
  );
}

export default App;
