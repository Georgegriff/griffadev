---
title: How trip yourself up with React hooks and break production.
description: Recently I started working on a new React codebase, here is a story of how I "corrected" some React hooks code and broke a feature in production, and then went on vacation.
tags:
  - JavaScript
  - React
date: "2022-01-10"
hero:
  image: "/images/react-hooks-mutations.png"
  alt: "Code snippet of React code from article."
---

React is so ubiquitous now it's pretty difficult to avoid it if you want to be employed and working in Web application development. React hooks in some ways pushed the ecosystem forward but in other ways have made React applications harder to debug and easier to subtly break things without realising, if you stop following the rules.

In this article is a story and some lessons about how I "corrected" some React code to follow the "rules" of hooks and broke the feature because the existing code happened to violate some of the other React "rules", in a way that was not immediately obvious.

## Writing about React is scary

Whenever I write a React article I question whether or not it is a good idea to do so because with its popularity can come some unhelpful comments and responses. To get this out of the way early here some replies on some previous comments I've received on React articles:

- "Your team just wrote sloppy react code. End of story." - I'd hate to work on a team with this person, jeez.
- "React is NOT a framework, it’s a JavaScript library." - I call it a framework just because it annoys people, for some reason, and I will continue to do so.
- "This is just an opinion piece" - ????? It's a blog post?

Anyways... to the article, I promise the above is the only sarcastic/cynical part of the post and I think there that there is some useful learning in this story to help me grow and hopefully others can find it useful to when working with the React framework.

## The scenario

The codebase that I work on is not open source, however the issue that I ran into could be extracted distilled into some example code as the core problems with the code centre around using some of the built in React hooks such as 'useMemo' and handling the mutation of state.

To demonstrate the problem I developed a completely unoriginal Todo-list example, hopefully the mundaneness of the code will help to skip over the boring bits and get to the issues with the code more quickly!

To demonstrate the problem with the code I have developed 3 examples all implementing the same Todo application:

- one with the original implementation "before" I refactored and broke it
- one with my refactor which broke the code in a specific way
- one with the changes I'd probably make in addition to my original refactor to fix the code.

> Full code examples will be available at the end of each section.

In order to reproduce the bug I experienced in the other codebase I needed the following:

- Some code to add some state from some data from the "server"
- React Context API (Technically optional)
- use of useMemo to transform some data from the "server"
- A button to "save" the state to the server
- Some optimisation logic to check if we should submit the changes to the server or not.

## Implementation

The implementation of the TodoList isn't too important, I scaffolded it out using [vite](https://vitejs.dev/). The important aspects of the code in this article live inside of a custom [Context](https://reactjs.org/docs/context.html) provider that implements the functionality of the TodoList.

Here is the outline of the top level `App` component:

```jsx
import React from "react";
import { AddTodo } from "./AddTodo";
import "./App.css";
import { SaveMessage } from "./SaveMessage";
import { SaveTodos } from "./SaveTodos";
import { TodoProvider } from "./TodoContext";
import { TodoList } from "./TodoList";
function App() {
  return (
    <TodoProvider>
      <div className="App">
        <div className="Flex">
          <h1>Todo list</h1>
          <SaveTodos />
        </div>
        <SaveMessage />
        <AddTodo />
        <div>
          <h2>Items to do</h2>
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
```

The `TodoProvider` is where we will focus on this article, it allows me to implement the logic for adding/deleting and saving todo items and share this between components.

Each of the components use aspects of the context provided by `TodoProvider`, for example, here is how the `AddTodo` component accesses the functionality to add a todo item:

```jsx
import { useTodos } from "./TodoContext";

export const AddTodo = () => {
  const { addTodo } = useTodos();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formEntries = new FormData(e.target);
        addTodo(formEntries.get("message"));
      }}
    >
      <input
        className="Input SearchBox"
        name="message"
        placeholder="New item..."
        id="addItem"
        type="text"
      />

      <button className="Button" type="submit">
        <span role="img" aria-label="Add item">
          ➕
        </span>
      </button>
    </form>
  );
};
```

I'll add in full code sandbox links at the end of each section.

## The original implementation

> Remember, this code is not the actual code from the codebase that I work on but is an example distilled from the issue that I came across.

The first thing that the `TodoProvider` does is fetch some data from the "server", in this case I've hardcoded a json file with some todo items in it.

```js
{
  "todos": [
    {
      "id": 1,
      "message": "Go to the supermarket",
      "done": false
    },
    {
      "id": 2,
      "message": "Mow the lawn",
      "done": true
    },
    {
      "id": 3,
      "message": "Clean the kitchen",
      "done": true
    },
    {
      "id": 4,
      "message": "Book restaurant reservation",
      "done": false
    }
  ]
}
```

Below I setup a context and fetch the JSON. It might seem odd to you that I am setting the API response into `useState`, this is a little contrived and just for the demo, before I get any "your code sucks comments". In the case of the real codebase this would have been a graphql `useQuery` hook.

There is a good reason why I am storing the response and not the the TODOs themselves, because I need to do a transform on the data and this is the closest way I could mimic was the original code was doing without introducing some fancy http client hook like [react-query](https://www.npmjs.com/package/react-query).

```js
export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [apiResponse, setApiResponse] = useState(undefined);
  const [draftTodos, setTodoList] = useState();

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("./todos.json");
      const response = await res.json();
      setApiResponse(response);
    };
    fetchTodos();
  }, []);

  // Transforming the data, use of useCallback looks odd here...
  // We'll get to that!
  const existingTodos = useCallback(() => {
    const todoMap = new Map();
    apiResponse?.todos.forEach((todo) => {
        todoMap.set(todo.id, todo);
   });

    return todoMap;
  }, [apiResponse]);

  return  return (
    <TodoContext.Provider value={{
        /* code coming soon */
    }}>
    {children}
    </TodoContext.Provider>
}
```

The second part of the code uses `useCallback` to create a function that converts the array of items into a map of todo items where the key is the id e.g.

```js
{
    1: {
      "id": 1,
      "message": "Go to the supermarket",
      "done": false
    },
    2: {
      "id": 2,
      "message": "Mow the lawn",
      "done": true
    },
    3: {
      "id": 3,
      "message": "Clean the kitchen",
      "done": true
    },
    4: {
      "id": 4,
      "message": "Book restaurant reservation",
      "done": false
    }
}
```

If you think the use of `useCallback` here is strange and `useMemo` would make sense, we both had the same thought and I wonder if you would end up introducing the same bug that I did by refactoring and correcting the code!

Now we're fetching Todo Items we want a way of adding new items. Before we do that I'm going to introduce a new concept to the above implementation, the notion of "draft todos", these are modified or new todo items which have not been saved back to the server just yet. To make that happen I add in:

```jsx
export const TodoProvider = ({ children }) => {
  // New line here!
  const [draftTodos, setTodoList] = useState();

  const [apiResponse, setApiResponse] = useState(undefined);
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("./todos.json");
      const response = await res.json();
      setApiResponse(response);
    };
    fetchTodos();
  }, []);


  const existingTodos = useCallback(() => {
    const todoMap = new Map();
    apiResponse?.todos.forEach((todo) => {
        todoMap.set(todo.id, todo);
   });

    return todoMap;
  }, [apiResponse]);

  // Other new line!
    useEffect(() => {
    // pass in initial items from server
    if (!draftTodos && existingTodos().size) {
      // this () is strange because useCallback was used
      setTodoList(existingTodos());
    }
  }, [existingTodos]);

  return  return (
    <TodoContext.Provider value={{
        todoItems: draftTodos ? Array.from(draftTodos.values()) : [],
    }}>
    {children}
    </TodoContext.Provider>
}
```

The purpose of the `useEffect` is so that on initialisation the draft todos equal the existing todo items.

In the new lines, if it wasn't clear before, hopefully it would be now that useCallback here is quite strange indeed because in order to read the existing you need to execute the `existingTodos` as a function.

> The keen eyed here will notice that this means a new map is being created each time you call the function, resetting the data back to the initial state from the json file. This also means the reference to the `Map` is different each time meaning unless you pass the output of the function around you aren't comparing the same map! This is key to the issue later on when `useMemo` is used instead!

### Adding and removing Todo items

These next two lines are more or less the existing code which was in place to add or remove items, and were exported onto the context.

```jsx
<TodoContext.Provider
  value={{
    todoItems: draftTodos ? Array.from(draftTodos.values()) : [],
    removeTodo: (id) => {
      if (draftTodos.delete(id)) {
        setTodoList(new Map(draftTodos));
      }
    },
    addTodo: (message) => {
      if (!message) {
        return;
      }
      const todo = {
        // new web api! - Support gradually increasing
        id: crypto.randomUUID(),
        message,
        done: false,
      };
      if (draftTodos.has(todo.id)) return;
      draftTodos.set(todo.id, todo);
      setTodoList(new Map(draftTodos));
    },
  }}
>
  {children}
</TodoContext.Provider>
```

These code examples also looked a little off to me too, but I couldn't quite understand why or put two and two together, at first. What the code is doing:

- Adding or Removing item from todo list
- Making a new Map with the entries from the previous map and setting it to the state.

There was in fact a comment next to the `new Map()` line which mentioned that this is needed in order to cause React to update, but it hadn't quite clicked with me that this was a bit of a problem.

If you hadn't noticed already, the lines above were mutating the previous map in both the add and remove methods, and then making a copy of it, polluting the previous data. Without any other changes this might not be a big deal at all, a bit bad in terms of best practice of not mutating objects in React, especially those used as state, but it works, but now let's take a look at the code for saving the new items.

### Saving items to the "server"

The code below is quite contrived and is missing the context as to why it was needed. But what the code does is check if the data had changed before sending it, it was a bit of an optimisation and there were other reasons too, but that's not important, let's take a look.

```jsx
<TodoContext.Provider
  value={{
    save: () => {
      // contrived code for the demonstration
      // in the real app this was responsible for deciding if a request should be sent to server or not
      const existingTodoKeys = Array.from(existingTodos().keys());
      const draftTodoKeys = Array.from(draftTodos.keys());
      let todosHasChanges = existingTodoKeys.length !== draftTodoKeys.length;
      // now check entries using ids, unless we know they have changed based on length
      // there are better ways of detecting changes but this demonstrates the issue
      if (!todosHasChanges) {
        const existingTodoValues = Array.from(existingTodos().values());
        const draftTodoValues = Array.from(draftTodos.values());
        for (let todoIndex = 0; todoIndex < draftTodoKeys.length; todoIndex++) {
          // now check each entry
          if (
            existingTodoKeys[todoIndex] !== draftTodoKeys[todoIndex] ||
            existingTodoValues[todoIndex].done !==
              draftTodoValues[todoIndex].done
          ) {
            todosHasChanges = true;
            break;
          }
        }
      }

      if (todosHasChanges) {
        // send off request to server
      }
    },
  }}
>
  {children}
</TodoContext.Provider>
```

Most of the above code doesn't matter but the general idea is that the two maps are being compared to one another. Here again strikes the `existingTodos()` which as we established before essentially "resets" the Map back to the original data from the server. It is in fact this property of code with the `useCallback` ensuring that `existingTodos()` is the original data from the server that makes this code work at all because the add and remove operations mutate the original array. If it wasn't for `existingTodos()` always fetching the un-mutated data the code would not function!

I suggest that this is an extremely obscure bug that only happens to not presents itself because of the use of useCallback to expose a function negates the mutation operations on the original map, instead of `useMemo` for example. Sadly, for me, I didn't notice this at the time... and I refactored it.

I've published a [code-sandbox](https://codesandbox.io/s/react-hooks-with-usecallback-and-mutations-pmmij) with the full code for this example that uses `useCallback`.

## How I broke production

As suggested to earlier, when working in this area of the code I took the chance to tidy up the code to use `useMemo` instead of `useCallback`. Unfortunately, this made the code fall over, and to make things even more fun I was going on vacation later that week, luckily someone in my team came in and reverted back to using useCallback, hopefully I'll be able to make the change to make the code less of a trap with the mutation of the Maps when I return, which I'll discuss at the end.

![Diff of the changes from using useCallback to useMemo](/images/memo-callback-diff.png "A diff of the changes made (note the diff is the wrong way around)")

```jsx
// main change - change to use useMemo which means existingTodos is the todos, not a function.
const existingTodos = useMemo(() => {
  const todoMap = new Map();
  apiResponse?.todos.forEach((todo) => {
    todoMap.set(todo.id, todo);
  });

  return todoMap;
}, [apiResponse]);

useEffect(() => {
  // removed `existingTodos` from being a function
  if (!draftTodos && existingTodos.size) {
    setTodoList(existingTodos);
  }
}, [existingTodos]);
```

```jsx
// And inside of the save function, removed existingTodos() as its not a function anymore
{
  save: () => {
    const existingTodoKeys = Array.from(existingTodos.keys());
    /// ...
    const existingTodoValues = Array.from(existingTodos.values());
  };
}
```

This change got through testing and code review, and was seemingly correct. However, due to the mutating of the original Map in the add/remove functions (which I'd missed), the first time you added or deleted something it would not be tracked as a change, meaning if you only added or removed one item in the list the request would not be sent to the server because the entries in the `existingTodos` had been mutated making the Maps essentially equal (not in terms of reference but contents, which is what the server cared about).

![Demo of the bug in a todo list app](/images/react-todo-memo-broken.gif "Here's the bug in action!")

Here is a [code-sandbox](https://codesandbox.io/s/use-memo-broken-code-with-mutations-lqk1u?file=/src/TodoContext.jsx) with the full code and demo that introduces the bug.

> Note that the checking and unchecking of items in the demo does not have an issue with mutating the original Map.

## Missed in testing

As noted above the issue where changes are incorrectly not reported only appears for the first change. The reason being that if you make two changes the code happens to work (sort of) because the array set by `useMemo` in this example never changes after its been mutated the one time, but the code for adding or removing items will stop modifying the original Map after the first mutation, instead it uses the latest draft todos map. Incidentally, the real testing scenario was a bit more complex and involved reordering items, so you might be able to see how this scenario could get missed.

This would be incredibly difficult to unit test as well, with the code being split across contexts and multiple components, unless you were testing the full end to end interactions you might not catch this at all!

## My suggested fix

The fix for the code is quite straight-forward and goes back to the original highlighted issue, the add and remove functions mutating the original map, they should not do this. Alternatively before setting the existing entries to the `draftTodos` variable you could make a copy then, either would work, although I think I prefer avoiding mutations at the point of new data - in the add and remove functions.

```js
removeTodo: (id) => {
  // make a copy first
  const newTodos = new Map(draftTodos);
  if (newTodos.delete(id)) {
    setTodoList(newTodos);
  }
},
```

```js
        addTodo: (message) => {
          if (!message) {
            return;
          }
          const todo = {
            id: crypto.randomUUID(),
            message,
            done: false,
          };
          if (draftTodos.has(todo.id)) return;
          // make a copy first
          const newTodos = new Map(draftTodos);
          newTodos.set(todo.id, todo);
          setTodoList(new Map(newTodos));
        },
```

Here is a [code-sandbox](https://codesandbox.io/s/working-todo-list-with-usememo-ns4px) of what I believe is functional code.

## Learnings

I suppose one of the main lessons here is to always be aware of where code could potentially be mutating your state, especially before introducing something like a `useMemo` into the code base.

More importantly, when refactoring code from an uncommon pattern (the useCallback) to something more typical it’s important to fully understand why that code might have happened in the first place, it's likely it might be a workaround for another issue. Another learning on my part is that this would had made good sense to start a dialogue with the person who wrote the original code, although that's easy to say in retrospect, there are many contributors.

Perhaps code comments might have saved this or some more unit tests, it’s hard to say. I can say for sure that we did do lots of testing in this area before shipping the bug to production but I suppose because it’s a bug that only happens on the first mutation and fixes itself if you do subsequent changes that might help to explain why it was missed. It's possible that some end to end test automation of this functionality might have caught this, as it seems likely that a human tester would go for the more complex scenario over a more basic test, e.g. a single mutation which might be present in an automated test.

Variable names can lie, the name of the variable also had the word `existing` in it in the other codebase too making it seem like this variable reference was representative of the original unmodified state, but due to the mutations it was not. I suppose it's a learning that you cannot always trust that a variable is what is says it is.

Maybe just don’t useMemo or useCallback or things that complicate the code - the work this component was doing to convert an array into a map, and ensure it wasn’t happening every render could well be redundant or overkill, part of my issue with react hooks is they can force you to introduce complexity for something as simple as converting from one data type to another and in doing this you can get struck by subtle bugs such as code mutating objects incorrectly or the incorrect use of react hooks ghastly dependency arrays.

## Summary

I suppose some people might read this and have the take that you should simply "Get Gud", but I'd suggest to take a step back and think about how ubiquitous React is and how many developers of differing experience can be working on a code base, I think it’s examples like this which help to show that it’s super easy to break things by modifying to use a different React hook or mutating something that should not have been mutated, and no Typescript can’t save you here, this was a Typescript codebase!

It might also be a fair argument to suggest that the bug presented here is not React specific, but I can say for sure the complexity that React can bring just to avoid rendering, or not rendering, does not help.

If you want to read about another instance of discussing bugs and areas of growth, I wrote about another scenario here from my previous role: [Memory leaks and why should you never write such bad code.](/posts/memory-leaks-and-why-should-you-never-write-such-bad-code-even-for-tests/)

Thank you for reading! If you want to read more of my work, please follow me on Twitter [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕.
