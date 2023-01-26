# 7 TRELLO CLONE

## 7.0 Get Selectors

우리는 칸반보드 형식의 어플리케이션을 만들어 볼것이다.
그전에 이 전 섹션에서 빼먹고 배우지 않은 selector의 set에 대해 배우자.

우선 모두 지우고 App.tsx에 두개의 input을 만들자. 둘다 number type으로 만든다.

```TypeScript
    <div className="App">
      <input type={'number'} placeholder="Minutes" />
      <input type={'number'} placeholder="Hours" />
    </div>
```

minutes input에 60을 적으면 hours에 1이 뜨게하자.

atoms.ts로 가서 하나의 atom을 만든다.

```TypeScript
export const minuteState = atom({
  key: 'minutes',
  default: 0,
});
```

minute 값을 받아오고 변경가능하게 하기 위해 useRecoilState을 사용하자.

```TypeScript
  const [minutes, setMinutes] = useRecoilState(minuteState);
  const onMinuteChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+e.currentTarget.value);//+는 string 형식인 숫자를 숫자로 바꿔줌
  };
  .
  .
  .
    <input type={'number'} placeholder="Minutes" onChange={onMinuteChange} />

```

이제 minuteState atom의 값이 hour에 영향을 미치게 해보자. atoms.ts로 가서 hourSelector를 만들자.

```TypeScript
export const hourSelector = selector({
  key: 'hours',
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
});

function App() {
  const [minutes, setMinutes] = useRecoilState(minuteState);
  const hours = useRecoilValue(hourSelector);
  const onMinuteChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+e.currentTarget.value);
  };
  return (
    <div className="App">
      <input type={'number'} placeholder="Minutes" onChange={onMinuteChange} />
      <input type={'number'} placeholder="Hours" value={hours} />
    </div>
  );
}
```

지금 아래의 input은 onChange이벤트가 없기 때문에 읽기 전용이다.
이제 반대로 시간을 minute으로 바꿔보자.

## 7.1 Set Selectors

이제 selector의 set속성에 대해 배우자. set은 state을 set하게 해준다.

```JavaScript
export const hourSelector = selector({
  key: 'hours',
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }) => {
    set(minuteState, 10);
  },
});
```

위 set 함수는 minuteState을 10으로 바꿔준다. set 항목의 함수는 첫번째 인자로 option을 보내고 두번째 인자로 newValue를 받는다. newValue를 넣어 확인해보자.

```JavaScript
  set: ({ set }, newValue) => {
    console.log(newValue);
  },
```

값을 확인하기 위해서 App.tsx로 가 useRecoilValue를 useRecoilState로 바꿔주자.

```JavaScript
  const [hours, setHours] = useRecoilState(hourSelector);

```

selector state의 첫번째 배열이 return 하는 건 get 항목의 값이고, 두번째는 set 항목을 실행시킨다. onHoursChange 함수를 만들어 실행시켜보자.

```TypeScript
  const onHourChange = (e: React.FormEvent<HTMLInputElement>) => {
    setHours(+e.currentTarget.value);
  };
  return (
    <div className="App">
      <input type={'number'} placeholder="Minutes" onChange={onMinuteChange} />
      <input
        type={'number'}
        placeholder="Hours"
        value={hours}
        onChange={onHourChange}
      />
    </div>
  );
```

콘솔을 확인하면 숫자가 들어가는게 보인다.
이제 hourSelector에서 minute의 값을 조정할수 있게 해보자.

```TypeScript
export const hourSelector = selector<number>({
  key: 'hours',
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minuteState, minutes);
  },
});

```

## 7.2 Drag and Drop part One

이제 드래그앤드롭을 배울차례다. react-beautiful-dnd라는 패키지를 사용한다. install하고 App.tsx에 임포트하자.

```TypeScript
import { DragDropContext } from 'react-beautiful-dnd';

function App() {
  return <DragDropContext></DragDropContext>;
}
```

위와 같이하면 onDragEnd라는 필수 prop과 children 요소가 없어서 오류가 난다.

```JavaScript
  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div></div>
    </DragDropContext>
  );
```

DragDropContext안에는 Droppable과 Draggable 요소가 필요하다. Droppable은 요소를 끌어당겨 놓을수 있는 컴포넌트, Draggable은 드래그 해서 옮길수 있는 요소다. 우선 하나의 Droppable 먼저 만들자.

```JavaScript
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one"></Droppable>
      </div>
    </DragDropContext>
```

Droppable에는 droppableId가 필수이다. 또한 children이 필요하다. 하지만 Droppable의 children은 react 요소가 될 수 없다. Droppable의 children은 함수여야 한다. 이는 Draggable도 마찬가지다.

```JavaScript
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one">
          {() => (
            <ul>
              <Draggable>{() => <li>Hello</li>}</Draggable>
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
```

Draggable에는 draggalbleId와 index prop이 필수이다.

```JavaScript
              <Draggable draggableId="one" index={1}>
                {() => <li>Hello</li>}
              </Draggable>
```

이걸 바탕으로 Draggable을 몇개더 만들어주자.

```JavaScript
            <ul>
              <Draggable draggableId="one" index={0}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="two" index={1}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="three" index={2}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="four" index={3}>
                {() => <li>Hello</li>}
              </Draggable>
            </ul>
```

이제 드래그를 위한 세팅은 끝났다.

## 7.3 Drag and Drop part Two

beautiful dnd가 주는 prop을 사용하자. Droppable 안의 함수의 첫번째 인자를 넣자. 뭐로 부르든 상관없다. 이는 그안의 ul에 prop으로 들어간다.

```JavaScript
        <Droppable droppableId="one">
          {(magic) => (
            <ul {...magic.droppableProps}>
              <Draggable draggableId="one" index={0}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="two" index={1}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="three" index={2}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="four" index={3}>
                {() => <li>Hello</li>}
              </Draggable>
            </ul>
          )}
        </Droppable>
```

그리고 reference도 넣어줘야 한다.

```JavaScript
            <ul {...magic.droppableProps} ref={magic.innerRef}>

```

이제 html 소스코드를 보면 다른 prop이 들어간걸 볼 수 있다.

Draggable에도 위와 같은 작업을 해주자.

```JavaScript
     <Draggable draggableId="one" index={0}>
       {(magic) => (
         <li
           ref={magic.innerRef}
           {...magic.dragHandleProps}
           {...magic.draggableProps}
         >
           Hello
         </li>
       )}
     </Draggable>
```

Draggable에선 draggableProps와 dragHandleProps가 있다. 요소가 기본적으로 전체가 드래그 되길 위한다면 draggableProps를 넣고 특정 핸들을 원하면 dragHandleProps를 사용하면 된다. 지금 li와 ul에 magic arg가 전해준걸 모두 전해줬다. 이제 코드를 실행해보면 드래그가 가능해진다. 하지만 지금 함수에 드롭이 끝나면 아무것도 실행하지 않기 때문에 드롭해도 순서가 변하지 않는다. 한번 핸들을 만들어보자. li안에 span을 하나 넣고 dragHandleProps를 주자.

```JavaScript
                {(magic) => (
                  <li ref={magic.innerRef} {...magic.draggableProps}>
                    <span {...magic.dragHandleProps}>🐈</span>
                    one
                  </li>
                )}
```

이제 handle이 고양이 이모지로 넘어갔다.

Draggable 들을 모두 지우자. 이젠 배열로 draggable 요소를 만들것이다.

## #7.4 Styles and Placeholders

Trello 에 맞게 색을 바꾸자. theme.ts으로 가서 바꿔주자.

```JavaScript
export const darkTheme: DefaultTheme = {
  bgColor: '#263E62',
  textColor: '#F9F871',
  boardColor: '#00BB99',
  cardColor: '#00678D',
  fontFamilly: "'Mukta', sans-serif;",
};
```

styled.d.ts도 바꿔주자.

```JavaScript
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor: string;
    cardColor: string;
    boardColor: string;
    textColor: string;
    fontFamilly: string;
  }
}

```

App.tsx로 가서 스타일을 주자.

```JavaScript
const Wrapper = styled.div`
  display: flex;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  width: 100%;
`;

const Board = styled.div`
  background-color: ${({ theme }) => theme.boardColor};
  padding: 30px 10px 20px 10px;
  border-radius: 5px;
  min-height: 200px;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardColor};
  border-radius: 5px;
  padding: 10px 10px;
`;

function App() {
  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Droppable droppableId="one">
            {(magic) => (
              <Board {...magic.droppableProps} ref={magic.innerRef}>
                <Draggable draggableId="one" index={0}>
                  {(magic) => (
                    <Card ref={magic.innerRef} {...magic.draggableProps}>
                      <span {...magic.dragHandleProps}>🦎</span>
                      One
                    </Card>
                  )}
                </Draggable>
              </Board>
            )}
          </Droppable>
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
```

이제 임시 todo리스트가 필요하다.

```JavaScript
const todos = [
  'study',
  'get groceries',
  'make dinner',
  'water the plants',
  'walk the dog',
  'take a nap',
  'do laundry',
];
```

todo 리스트를 렌더링 해주자.

```JavaScript
       {todos.map((val, idx) => (
         <Draggable draggableId={val.slice(0, 3)} index={idx}>
           {(magic) => (
             <Card
               ref={magic.innerRef}
               {...magic.dragHandleProps}
               {...magic.draggableProps}
             >
               <span>🦎</span>
               {val}
             </Card>
           )}
         </Draggable>
       ))}
```

그런데 한가지 문제가 있다. 요소를 옮기면 보드가 작아졌다 커지는데 애니메이션이 없어서 이쁘지 않다. magic을 살펴보자. 함수의 arg로 들어간 magic을 우클릭하고 Go to Type Definition을 보면 된다. 그럼 실제 magic안에 placeholder가 있는걸 볼 수 있다. 보드 맨밑에 magic.placeholder를 두자.

```JavaScript
            {(magic) => (
              <Board {...magic.droppableProps} ref={magic.innerRef}>
                {todos.map((val, idx) => (
                  <Draggable draggableId={val.slice(0, 3)} index={idx}>
                    {(magic) => (
                      <Card
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                      >
                        <span>🦎</span>
                        {val}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {magic.placeholder}
              </Board>
            )}
```

이제 드래그를 해도 보드의 사이즈는 고정된다.
