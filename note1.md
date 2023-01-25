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

DragDropContext안에는 Droppable과 Draggalbe 요소가 필요하다. Droppable은 요소를 끌어당겨 놓을수 있는 컴포넌트, Draggalbe은 드래그 해서 옮길수 있는 요소다. 우선 하나의 Droppable 먼저 만들자.

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
