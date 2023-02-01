import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import DraggableCard from './DraggableCard';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ITodo, todoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.boardColor};
  padding: 30px 10px 20px 10px;
  border-radius: 5px;
  min-height: 200px;
  transition: all 0.2s;
  box-shadow: 0px 12px 16px 0px #1b034f;
  display: flex;
  flex-direction: column;
  > h2 {
    text-align: center;
    padding: 20px;
    background-color: ${({ theme }) => theme.cardColor};
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: inset 3px 3px 12px 0px #1b034f;
  }
`;

const Form = styled.form`
  width: 100%;
  > input {
    width: 100%;
  }
`;

interface IArea {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Area = styled.div<IArea>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? 'pink'
      : props.draggingFromThisWith
      ? 'tomato'
      : 'blue'};
  flex-grow: 1;
  transition: background-color 0.2s;
`;

interface IBoardProps {
  todos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Board = ({ todos, boardId }: IBoardProps) => {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const setTodos = useSetRecoilState(todoState);
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setTodos((prev) => {
      return { ...prev, [boardId]: [...prev[boardId], newTodo] };
    });
    setValue('toDo', '');
  };
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Wrapper>
      <h2>{boardId}</h2>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('toDo', { required: true })}
          type={'text'}
          placeholder={`Write ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            {...magic.droppableProps}
            ref={magic.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
          >
            {todos.map((val, idx) => (
              <DraggableCard
                key={val.id}
                todoText={val.text}
                todoId={val.id}
                index={idx}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
