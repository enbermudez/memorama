const Cell = ({ handleCellClick, data: { position, emoji, matchPosition, revealed, matched } }) => {
  const handleClick = () => {
    handleCellClick(position, matchPosition);
  };

  return (
    <div className="cell" onClick={handleClick}>{ revealed || matched ? emoji : '❔'}</div>
  );
}

export default Cell;
