import React, { useState } from "react";
import "./App.css";
import {addBook, editBook} from './service';

function BookForm() {
    const id = null;
    const [title, setTitle] = useState('initialTitleValue');
    const [authors, setAuthors] = useState([
        {id: null, name: ""},
    ]);
    const [genres, setGenres] = useState([
        {id: null, name: ""},
    ]);

    const handleChangeAuthor = (index, event) => {
        let newAuthors = authors.slice();
        newAuthors[index].name = event.target.value;
        setAuthors(newAuthors)
    }

    const handleChangeGenres = (index, event) => {
        let newGenres = genres.slice();
        newGenres[index].name = event.target.value;
        setGenres(newGenres)
    }

    const handleAddAuthor = () => {
        setAuthors([...authors, {id: null, name: ""}]);
    }

    const handleAddGenre = () => {
        setGenres([...genres, {id: null, name: ""}]);
    }

    const handleRemoveAuthor = (index) => {
        let newAuthors = authors.slice();
        newAuthors.splice(index, 1);
        setAuthors(newAuthors);
    }

    const handleRemoveGenre = (index) => {
        let newGenres = genres.slice();
        newGenres.splice(index, 1);
        setGenres(newGenres);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        var jsonData = {};
        jsonData["id"] = id;
        jsonData["title"] = title;
        jsonData["authors"] = authors.filter(a => a.name !== "");
        jsonData["genres"] = genres.filter(g => g.name !== "");
        
        var json = JSON.stringify(jsonData, (key, value) => {
            if (value !== null) return value
          });

        if(jsonData["id"] === null) {
            addNewBook(json);
        }
        else {
            updateBook(id, json);
        }
    };

    const addNewBook = (json) => {
        const promice = addBook(json);
        promice.then(
          (result) => {
            console.log(json)
          },
          (error) => {
            console.error('Failed to add new book');
            throw error
          }
        )
    }

    const updateBook = (bookId, json) => {
        const promice = editBook(bookId, json);
        promice.then(
          (result) => {
            console.log(json)
          },
          (error) => {
            console.error('Failed to edit book ' + bookId);
            throw error
          }
        )
    }

    return (
        <div>
            <h1>{id ? 'Edit Book' : 'Add New Book'}</h1>
            <form>
                <label htmlFor="title">Title:</label><br/>
                <input type="text" id="title" name="title" value={title}
                onChange={(event) => setTitle(event.target.value)}/>
                <br/>
                <br/>
                {authors.map((author, index) => (
                    <div key={index}>
                        <label htmlFor="Author name">Author name:</label><br/>
                        <input type="text" id="Author name"
                         name="authorName" value={author.name}
                         onChange={(event) => handleChangeAuthor(index, event)}/>
                        <button onClick={() => handleAddAuthor()} type="button">Add author</button>
                        <button disabled={authors.length === 1} 
                                onClick={() => handleRemoveAuthor(index)} type="button">
                                    Remove author</button>
                    </div>
                ))}
                <br/>
                {genres.map((genre, index) => (
                    <div key={index}>
                        <label htmlFor="Genre name">Genre name:</label><br/>
                        <input type="text" id="Genre name"
                         name="genreName" value={genre.name}
                         onChange={(event) => handleChangeGenres(index, event)}/>
                         <button onClick={() => handleAddGenre()} type="button">Add genre</button>
                         <button disabled={genres.length === 1} 
                                onClick={() => handleRemoveGenre(index)} type="button">
                                    Remove genre</button>
                    </div>
                ))}
                <br/>
                <div>
                    <button id="submitButton" onClick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default BookForm;