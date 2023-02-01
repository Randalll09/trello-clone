# TRELLO CLONE

## 7.9 Same Board Movement

일단 개별 보드의 드래그앤 드롭 기능을 복구하자.

매번 drop 할때 마다 어떤 정보를 얻었는지 기억하자. onDragEnd 를 실행할때마다 함수가 실행되고 그 움직임에 대한 정보를 얻는다.

App.tsx로 가서 onDragEnd 함수를 고치자.

```JavaScript
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
  };
```

우선 source 보드와 destination 보드가 같은지 확인해야 한다. destination 과 source의 dropppableId 가 같은지 확인하면 된다.

```JavaScript
    if(destination?.droppableId===source.droppableId){}

```

todoState의 해당 dropppableId를 가진 배열을 복사하자. 그리고 전의 모든 객체를 return하고 같은 키값의 항목을 뒤에 더해주면 그 키값의 수치가 변경된다.

```JavaScript
     setTodos((prev) => {
        const dragged = prev[source.droppableId][source.index];
        const boardCopy = [...prev[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, dragged);
        return { ...prev, [source.droppableId]: boardCopy };
      });
```

object는 중복 키값이 있으면 마지막에 있는 값을 사용하기 때문이다.

## 7.10 Cross Board Movement

이제 보드를 건너 움직이게 해보자. 만약 droppableId가 일치하지 않으면 다른 보드로 옮겼단 의미다.

```JavaScript
    if (destination.droppableId !== source.droppableId) {}
```

그렇다면 우리는 옮겨진 보드와, 옮긴보드 둘의 복사본을 만들어야 한다.

sourceBoard와 destinationBoard를 선언해주자.

```JavaScript
      setTodos((prev) => {
        const dragged = prev[source.droppableId][source.index];
        const sourceBoard = [...prev[source.droppableId]];
        const destinationBoard = [...prev[destination.droppableId]];
        return prev;
      });
```

그리고 위와 같이 splice 한 뒤 return 하자.

```JavaScript
    if (destination.droppableId !== source.droppableId) {
      setTodos((prev) => {
        const dragged = prev[source.droppableId][source.index];
        const sourceBoard = [...prev[source.droppableId]];
        const destinationBoard = [...prev[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, dragged);
        return {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
```

## 7.11 Droppable Snapshot

카드를 움직일때 효과를 줘보자. 보드를 떠나는지 넣는지에 따라 색상 효과를 줘보자.

```JavaScript
<Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area {...magic.droppableProps} ref={magic.innerRef}>
            {todos.map((val, idx) => (
              <DraggableCard todo={val} idx={idx} />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
```

두번째 arg는 isDraggingOver, draggingFromThisWith등에 대한 boolean을 제공한다. Area에게 prop으로 제공하자.

```JavaScript
const Area = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) => (props.isDraggingOver ? 'pink' : 'blue')};
  flex-grow: 1;
`;
interface IBoardProps {
  todos: string[];
  boardId: string;
}

const Board = ({ todos, boardId }: IBoardProps) => {
  return (
    <Wrapper>
      <h2>{boardId}</h2>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            {...magic.droppableProps}
            ref={magic.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {todos.map((val, idx) => (
              <DraggableCard todo={val} idx={idx} />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

```

이제 드래그해서 위로 올리면 Area의 색이 변한다. draggingFromThisWith도 추가해주자.

```JavaScript
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
`;
.
.
.
          <Area
            {...magic.droppableProps}
            ref={magic.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
          >
```

## 7.12 Final Styles

카드에도 스타일을 주자.

```JavaScript
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
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
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
```
