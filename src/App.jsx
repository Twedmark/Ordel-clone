import "./App.css";
import Home from "./pages/Home";
import { createContext, useEffect, useState } from "react";

const word = {
  triedLetters: [],
  lettersInWrongPlace: Array(5).fill(""),
  lettersInRightPlace: Array(5).fill(""),
};

export const GameContext = createContext(word);
export const RowContext = createContext(null);

function App() {
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    async function getTodaysWord() {
      await fetch("http://localhost:3001/api/word").then((res) => {
        res.json().then((data) => {
          console.log(data.word);
        });
      });
    }

    getTodaysWord();
  }, [word]);

  return (
    <GameContext.Provider value={word}>
      <RowContext.Provider value={{ activeRow, setActiveRow }}>
        <div className="App">
          <Home />
        </div>
      </RowContext.Provider>
    </GameContext.Provider>
  );
}

export default App;
