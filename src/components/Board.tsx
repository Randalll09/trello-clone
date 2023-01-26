import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import DraggableCard from './DraggableCard';

const Wrap = styled.div`
  background-color: ${({ theme }) => theme.boardColor};
  padding: 30px 10px 20px 10px;
  border-radius: 5px;
  min-height: 200px;
  transition: all 0.2s;
  box-shadow: 0px 12px 16px 0px #1b034f;
  > h2 {
    text-align: center;
    padding: 20px;
    background-color: ${({ theme }) => theme.cardColor};
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: inset 3px 3px 12px 0px #1b034f;
  }
`;

interface IBoardProps {
  todos: string[];
  boardId: string;
}

const Board = ({ todos, boardId }: IBoardProps) => {
  return (
    <Droppable droppableId={boardId}>
      {(magic) => (
        <Wrap {...magic.droppableProps} ref={magic.innerRef}>
          <h2>{boardId}</h2>
          {todos.map((val, idx) => (
            <DraggableCard todo={val} idx={idx} />
          ))}
          {magic.placeholder}
        </Wrap>
      )}
    </Droppable>
  );
};

export default Board;
