import React, { useEffect, useState } from 'react';
import './TabooWordsControl.scss';

function TabooWordsControl() {
    const [tabooWords, setTabooWords] = useState([]);
    const [newTabooWord, setNewTabooWord] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/get-all-taboo-words", {
        method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
        setTabooWords(data);
        });
    }, []);

  const handleDeleteTabooWord = (id, word) => {
    if (window.confirm(`Are you sure you want to delete the taboo word "${word}"`)) {
      fetch("http://localhost:3001/delete-taboo-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          tabooWordId: id,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        alert(data.data);
        // If deletion is successful, update the state to reflect the changes
        setTabooWords(tabooWords.filter((word) => word._id !== id));
      });
    }
  };

  const handleCreateTabooWord = () => {
    // Perform input validation if needed

    fetch("http://localhost:3001/create-taboo-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        word: newTabooWord,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      alert(data.data);
      // If creation is successful, update the state to reflect the changes
      setTabooWords([...tabooWords, { _id: data.tabooWordId, word: newTabooWord }]);
      // Clear the input field after creating a new taboo word
      setNewTabooWord('');
    });
  };

  return (
    <div className="boxed-section">
      <div className="add-taboo-word">
        <input
          type="text"
          placeholder="Enter new taboo word"
          value={newTabooWord}
          onChange={(e) => setNewTabooWord(e.target.value)}
        />
        <button className="add-button" onClick={handleCreateTabooWord}>
          Add
        </button>
      </div>
      <div className="taboo-word-container">
        {tabooWords.map((tabooWord) => (
          <div className="taboo-word-row" key={tabooWord._id}>
            <div className="taboo-word">{tabooWord.word}</div>
            <button
              className="delete-button"
              onClick={() => handleDeleteTabooWord(tabooWord._id, tabooWord.word)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabooWordsControl;
