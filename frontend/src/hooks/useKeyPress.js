import { useEffect } from "react";

const handleKeyPress = (
  event,
  rows,
  gameStatus,
  loading,
  setAnimate,
  setRows,
  dispatch,
  setGameStatus,
  BASE_URL
) => {
  document.activeElement.blur();
  setAnimate(false);
  const handleRow = async (row, rowIndex) => {
    if (gameStatus.activeRow === 5 || gameStatus.gameOver || loading) {
      if (gameStatus.gameOver || gameStatus.activeRow === 5) {
        console.log("The game is over");
      } else if (loading) {
        console.log("Loading game data, please wait...");
      }
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
      if (row.board.includes("")) {
        setAnimate(true);
        console.log("Please fill in all fields!");
        return;
      }
      const tiles = document.querySelectorAll(".tile.active");
      tiles.forEach((tile) => {
        tile.classList.add("loading");
      });

      console.time("fetchTime");
      const response = await fetch(`${BASE_URL}api/allowedWord/${guess}`).then(
        (res) => {
          return res.json();
        }
      );
      console.timeEnd("fetchTime");

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
      if (response.allCorrect) {
        setGameStatus((prevStatus) => {
          return { ...prevStatus, gameOver: true };
        });
        console.log("Correct word!");
        return;
      }

      if (gameStatus.activeRow === 4 && !response.allCorrect) {
        const rightWord = await fetch(BASE_URL + "api/word").then((res) => {
          return res.json();
        });

        console.log(
          "Sorry that was wrong, the right word was: " + rightWord.word
        );
      }
    }
  };

  handleRow(rows[gameStatus.activeRow], gameStatus.activeRow);
};

const useKeyPress = (
  rows,
  gameStatus,
  loading,
  setAnimate,
  setRows,
  dispatch,
  setGameStatus,
  BASE_URL
) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(
        event,
        rows,
        gameStatus,
        loading,
        setAnimate,
        setRows,
        dispatch,
        setGameStatus,
        BASE_URL
      );
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    rows,
    gameStatus,
    loading,
    setAnimate,
    setRows,
    dispatch,
    setGameStatus,
    BASE_URL,
  ]);
};

export default useKeyPress;
