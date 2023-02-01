# TRELLO CLONE

## 7.13 Refs

리스트에 todo를 넣어줄 기능을 넣자.
ref를 쓸건데 react로 html요소를 잡을구 있는 방법이다.

button을 눌러 input에 focus를 주는 방법을 사용하자.

```JavaScript
  const onClick = () => {};
.
.
      <input placeholder="grabMe" />
      <button onClick={onClick}>Click</button>
```

input에 ref를 주자. 이럼으로써 input에 접근성을 가진다.

```JavaScript
  const inputRef = useRef<HTMLInputElement>(null);
.
.
      <input ref={inputRef} placeholder="grabMe" />

```

이제 클릭이벤트 함수에 input에 focus를 주게 하자.

```JavaScript
  const onClick = () => {
    inputRef.current?.focus();
  };
```

## 7.14 Task Objects

Board에 useForm을 추가하고 interface를 만들자.

```JavaScript
interface IForm {
  toDo: string;
}

  const { register, setValue, handleSubmit } = useForm<IForm>();
```

form을 만들어주자.

```JavaScript
  const onValid = (data: IForm) => {};
.
.
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('toDo', { required: true })}
          type={'text'}
          placeholder={`Write ${boardId}`}
        />
      </Form>
```

atomState를 바꾸자.

```JavaScript
export interface ITodo {
  id: number;
  text: string;
}

interface ITodoState {
  [key: string]: ITodo[];
}

export const todoState = atom<ITodoState>({
  key: 'todos',
  default: {
    'To Do': [],
    Doing: [],
    Done: [],
  },
});

```

board에서 받는 IBoardProps도 수정이 필요하다.

```JavaScript
interface IBoardProps {
  todos: ITodo[];
  boardId: string;
}
```

이제 DraggableCard도 수정하자.

```JavaScript
interface IDraggableProps {
  todoId: number;
  todoText: string;
  index: number;
}

const DraggableCard = ({ todoId, todoText, index }: IDraggableProps) => {
  return (
    <Draggable
      draggableId={todoId+''}
      index={index}
      key={todoId}
    >
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


```

## 7.15 Creating Tasks

useSetRecoilState로 todoState에 값을 넣게 해주자.

todo를 생성할때 해당 보드의 요소로 들어갈수 있게 해야한다.

```JavaScript
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
```
