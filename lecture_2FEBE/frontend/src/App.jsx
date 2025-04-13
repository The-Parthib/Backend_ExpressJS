import { useEffect } from "react";
import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <h1>Parthib aur Full Stack</h1>
      <p>JOKES: {jokes.length}</p>
      {jokes.map((joke) => {
        return (
          <div key={jokes.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        );
      })}
    </>
  );
}

export default App;
