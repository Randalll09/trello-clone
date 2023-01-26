import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import React from 'react';

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardColor};
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 20px;
  box-shadow: inset -3px -3px 12px 0px #1b034f82;
`;

interface IDraggableProps {
  todo: string;
  idx: number;
}

const DraggableCard = ({ todo, idx }: IDraggableProps) => {
  console.log(todo, 'is rerendered');
  return (
    <Draggable
      draggableId={todo.slice(0, 3)}
      index={idx}
      key={todo.slice(0, 3)}
    >
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {todo}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
