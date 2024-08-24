import { useEffect, useState } from 'react';

const App = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch('/test')
    .then(res => res.json())
    .then(data => {
      setTests([...data]);
    }).catch(err => {
      console.log(err)
    });
  }, []);

  return (
    <div>
      {tests.map((item, index) =>
        <p key={index}>{item.title} : {item.description}</p>
      )}
    </div>
  );
}

export default App;