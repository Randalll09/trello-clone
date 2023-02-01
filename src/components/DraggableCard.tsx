import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import React from 'react';
import { ITodo } from '../atoms';

const Card = styled.div<{
  isDragging: boolean;
}>`
  background-color: ${(props) =>
    props.isDragging ? 'beige' : props.theme.cardColor};
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 20px;
  box-shadow: inset -3px -3px 12px 0px #1b034f82;
`;

interface IDraggableProps {
  todoId: number;
  todoText: string;
  index: number;
}

const DraggableCard = ({ todoId, todoText, index }: IDraggableProps) => {
  return (
    <Draggable draggableId={todoId + ''} index={index} key={todoId}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {todoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
