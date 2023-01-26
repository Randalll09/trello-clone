# TRELLO CLONE

## 7.5 Reordering

이번에는 아이템이 드롭되었을때 재정렬 되게 하자. 우선 atoms.ts를 만들어 todo atom을 생성한다.

```JavaScript
export const todoState = atom({
  key: 'todos',
  default: [
    'study',
    'get groceries',
    'make dinner',
    'water the plants',
    'walk the dog',
    'take a nap',
    'do laundry',
  ],
});
```

App.tsx에서 useRecoilState로 todoState 값을 가져오자.

```JavaScript
  const [todos, setTodos] = useRecoilState(todoState);
```

이제 onDragEnd 함수를 만들자. 드래그가 끝났을때 atom을 수정해야 한다. onDragEnd가 무엇을 리턴하는지 확인하자.

```JavaScript
  const onDragEnd = (arg: any) => {
    console.log(arg);
  };
```

arg에는 draggableId와 destination, source 등이 있다. draggableId는 어떤 요소가 움직였는지 알려주고 destination은 어디로 이동했는지 알려준다. destination은 항목으로 droppableId와 index가 있다. source는 어디서 왔는지 알려주는데 역시 droppableId와 index를 알려준다.

destination과 source를 사용해 index를 바꾸는 작업을 하자.

```JavaScript
  const onDragEnd = ({destination,source}) => {
  };
```

하지만 위와 같이하면 타입이 맞지 않는다고 한다. DropResult 인터페이스를 react-beautiful-dnd에서 import하고 적용해주자.

```JavaScript
  const onDragEnd = ({ destination, source }: DropResult) => {};

```

우리는 todo로 두가지 작업을 할것이다.

1. array 부터 source.index를 지운다. 예컨데 source.index가 4번째라면 4번째 아이템을 삭제하는 식이다.
2. destination index의 위치에 방금 삭제한 아이템을 추가한다.

그럼 array의 요소를 지우는 법을 알아보자. 우린 splice라는 메소드를 사용할 것이다. splice는 배열을 수정한다. 2개의 arg를 받느데 첫번째는 지우기 시작하는 위치고, 두번째는 지우는 갯수이다. 3개의 arg를 받는 경우도 있는데 3번째 arg는 지운자리에 들어갈 요소다.

```JavaScript
arr.splice(2,1)//인덱스 2 부터 하나의 요소를 지운다.
arr.splice(3,0,"add")//인덱스 3에서 아무것도 지우지 않고 그 자리에 "add"를 추가한다.

```

## 7.6 Reordering part Two

splice에 대해 알아둬야 할점은 splice는 기본적으로 기존 배열을 영구적으로 변경한다는 점이다. 그러므로 기존배열을 [...arr]로 받아 복제된 배열을 splice 하는 것이 좋다.

splice를 배웠으니 recoil에 적용해보자.

```JavaScript
  const onDragEnd = ({ destination, source }: DropResult) => {
    setTodos((prev) => {
      const copy = [...prev];
      return copy;
    });
  };
```

첫번째로 source.index의 아이템을 삭제하자.

```JavaScript
      copy.splice(source.index, 1);

```

두번째로 아이템을 destination에 돌려놓자. 그런데 destination에 오류가 나므로 destination이 없을땐 그냥 return시키자.

```JavaScript
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    setTodos((prev) => {
      const copy = [...prev];
      copy.splice(source.index, 1);
      copy.splice(destination.index, 0, prev[source.index]);
      return copy;
    });
  };
```

오류가 날 수 있으니 droppableId와 key를 같은 값으로 두자. 두 값은 늘 같아야 한다.

```JavaScript
                  <Draggable
                    draggableId={val.slice(0, 3)}
                    index={idx}
                    key={val.slice(0, 3)}
                  >
```

이제 실행해보면 드래그앤 드롭이 잘 된다.

이제 최적화를 해주자. 우리가 드래그 할때 마다 리액트는 늘 모든 요소를 재렌더링 하고 있다.

## 7.7 Performance

최적화 하기전에 코드를 정리해주자.

```JavaScript
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardColor};
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 20px;
`;

interface IDraggableProps {
  todo: string;
  idx: number;
}

const DraggableCard = ({ todo, idx }: IDraggableProps) => {
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
          <span>🦎</span>
          {todo}
        </Card>
      )}
    </Draggable>
  );
};

export default DraggableCard;
```

후에 Board컴포넌트도 만들어야 하지만 일단은 넘어가자.

리액트는 만일 부모 요소의 state가 바뀌면 모든 자식 요소들이 재렌더링 된다. 재렌더링 될 필요가 없는 자식 요소들 까지도 재렌더링 되면 앱의 속도가 느려진다. 여기서 react memo를 쓴다. react memo는 react에게 prop이 변경되지 않는다면 재렌더 하지 말라고 하는 역할을 한다. memo를 쓰는 방법은 아래와 같다.

```JavaScript
export default React.memo(DraggableCard);

```

모든 것에 memo를 쓸 필요는 없다. 불필요한 재렌더가 너무 많이 일어날때만 쓰면 된다.

## 7.8 Multi Boards

이제 앱에서 다수의 보드를 사용가능하게 하자.

3개의 보드를 만들건데, To do, Doing, Done을 만들 것이다. atoms.ts에서 todoState을 수정해주자.

```JavaScript
export const todoState = atom({
  key: 'todos',
  default: {
    todo: ['study', 'get groceries', 'make dinner'],
    doing: ['water the plants', 'walk the dog'],
    done: ['take a nap', 'do laundry'],
  },
});

```

이제 App.tsx의 todos는 array가 아닌 객체이므로 렌더링 방식을 바꿔주고, 그 김에 Board 컴포넌트도 하나 만들자.

```JavaScript
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import DraggableCard from './DraggableCard';

const Wrap = styled.div`
  background-color: ${({ theme }) => theme.boardColor};
  padding: 30px 10px 20px 10px;
  border-radius: 5px;
  min-height: 200px;
  transition: all 0.2s;
`;

interface IBoardProps {
  todos: string[];
  boardId: string;
}

const Board = ({ todos, boardId }: IBoardProps) => {
  <Droppable droppableId={boardId}>
    {(magic) => (
      <Wrap {...magic.droppableProps} ref={magic.innerRef}>
        {todos.map((val, idx) => (
          <DraggableCard todo={val} idx={idx} />
        ))}
        {magic.placeholder}
      </Wrap>
    )}
  </Droppable>;
};

export default Board;

```

object를 map 할 수 없으니 object를 loop 하는 방법을 보자.

콘솔에 객체를 만들자.

```JavaScript
const obj={x:["a","b","c"], y:["d","e","f"],z:["g","h"]}
```

여기서 각 property의 배열을 받아 렌더해보자.
Object.keys(object) 메소드를 이용하면 각 property 를 배열로 return 한다.
Object.values(object) 메소드를 이용하면 각 key의 value를 배열로 return한다.

이걸 활용해 각 property의 배열을 각자 렌더링하자.

```JavaScript
Object.keys(obj).map(val=>obj[val])

//[["a","b","c"],["d","e","f"],["g","h"]]
```

이제 App.tsx에도 적용하자.

```JavaScript
        <Boards>
          {Object.keys(todos).map(boardId=><Board boardId={boardId} key={boardId} todos={todos[boardId]} />)}
        </Boards>
```

그런데 위와 같이 하면 boardId가 string인지 알수 없어 에러가 난다. atoms.ts로 가서 interface를 만들자.

```JavaScript
interface ITodoState {
  [key: string]: string[];
}
```
