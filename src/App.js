import { useEffect, useState } from 'react';
import classnames from 'classnames';
import Cell from './components/Cell';
import helpers from './helpers';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐼', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦊', '🦝', '🐗', '🐺'];

const MATCH_MESSAGES = [
  'Nada mal, acertaste.',
  'Buena memoria, si señor.',
  '¿Hiciste trampa con esta o...?',
  'Otra parejita que armaste.',
  'Mi alegría depende de tus aciertos, sigue así.',
  'Te ayudaría, pero parece que sabes lo que haces.',
  'Así me gusta, sigue adivinando',
  '¡Vamos, cada vez más cerca!',
];

const MISS_MESSAGES = [
  'Ups, esa no era la casilla correcta.',
  'Dale, es re-obvia la posición.',
  '¿Necesitas ayuda? Porque, damn...',
  'No me pagan lo suficiente para esto.',
  'Las otras personas lo hicieron más rápido.',
  '¿En verdad?',
  '¿Por qué tardas tanto?',
  'Me iría, pero no soy más que código.',
];

const App = () => {
  const [cells, setCells] = useState([]);
  const [disabledBoard, setDisabledBoard] = useState(false);
  const [message, setMessage] = useState('¡Dale, elige un par de casillas!');
  const [gameOver, setGameOver] = useState(false);

  const handleCellClick = (position, matchPosition) => {
    console.log(matchPosition);

    let newCells = cells.map((piece) => {
      if (piece.position === position) piece.revealed = true;
      return piece;
    });

    const anotherPieceWasRevealed = cells.some((piece) => {
      if (piece.position !== position && piece.revealed && !piece.matched) return true;
      return piece;
    });

    if (anotherPieceWasRevealed) {
      const revealedPiece = newCells.find((piece) => piece.revealed && !piece.matched && piece.position !== position);

      if (revealedPiece.position === matchPosition) {
        setMessage(helpers.random(MATCH_MESSAGES));

        newCells = newCells.map((piece) => {
          if (piece.position === revealedPiece.position || piece.position === position) piece.matched = true;
          return piece;
        });

        return setCells(newCells);
      }

      setDisabledBoard(true);
      setMessage(helpers.random(MISS_MESSAGES));

      setTimeout(() => {
        newCells = newCells.map((piece) => {
          if (piece.position === revealedPiece.position || piece.position === position) piece.revealed = false;
          return piece;
        });

        setCells(newCells);
        setDisabledBoard(false);
      }, 2000);

      return;
    }

    setCells(newCells);
  };

  const setupGame = () => {
    let pieces = helpers.shuffle([...EMOJIS, ...EMOJIS]).map((emoji, idx) => ({ position: idx, emoji, matchPosition: 0, revealed: false, matched: false }));

    pieces = pieces.map((piece, idx) => {
      const matchPosition = pieces.find((p, jdx) => p.emoji === piece.emoji && idx !== jdx).position;
      piece.matchPosition = matchPosition;
      return piece;
    });

    setCells(pieces);
  };

  const restartGame = () => {
    setMessage('¡Dale, elige un par de casillas!');
    setGameOver(false);
    setupGame();
  };

  useEffect(() => {
    const isGameOver = cells.length && cells.every((piece) => piece.matched);

    if (isGameOver) {
      setGameOver(isGameOver);
      setMessage('¡Ganaste!');
    }
  }, [cells]);

  useEffect(() => {
    setupGame();
  }, []);

  return (
    <>
      <div className="message">{message}</div>

      <div className={classnames('gameboard', { disabled: disabledBoard })}>
        {
          cells.map((cell) => {
            return (
              <Cell
                handleCellClick={handleCellClick}
                key={cell.position}
                data={cell}
              />
            )
          })
        }
      </div>

      <button
        className={classnames('restart', { hidden: !gameOver })}
        onClick={restartGame}
      >
        ¡Jugar otra vez!
      </button>
    </>
  );
}

export default App;
