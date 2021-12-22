import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {fetchBooks, deleteBook} from './service';
import BookForm from './BookForm';

function BookAuthors(props) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Author id</th>
          <th>Author name</th>
        </tr>
        {props.authors.map(author => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.name}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function BookGenres(props) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Genre id</th>
          <th>Genre name</th>
        </tr>
        {props.genres.map(genre => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      books: []
    };
  }

  componentDidMount() {
    const promice = fetchBooks();
    promice.then(
      (result) => {
        this.setState({
          isLoaded: true,
          books: result,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: error
        });
      }
    )
  }

  render() {
    const { error, isLoaded, books } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <table>
          <caption>
            <p>Add new book: </p>
            <button onClick={() => this.handleAddBookButton()}>Add book</button>
          </caption>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Genres</th>
              <th>Actions</th>
            </tr>
            {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td><BookAuthors authors={book.authors}></BookAuthors></td>
                  <td><BookGenres genres={book.genres}></BookGenres></td>
                  <td>
                    <button onClick={() => this.handleUpdateBookButton(book.id)}>Update book</button>
                    <button onClick={() => {console.log('Comments page')}}>Watch comments</button>
                    <button onClick={() => this.handleDeleteButton(book.id)}>Delete book</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>    
      );
    }
  }

  handleAddBookButton() {
    ReactDOM.render(
      <BookForm/>,
      document.getElementById('root')
    );
  }

  handleUpdateBookButton(bookId) {
    ReactDOM.render(
      <BookForm/>,
      document.getElementById('root')
    );
  }

  handleDeleteButton(bookId) {
    const promice = deleteBook(bookId);
    promice.then(
      (result) => {
        const books = this.state.books.slice()
        this.findAndRemove(books, 'id', bookId);
        this.setState({
          books: books,
        });
      },
      (error) => {
        console.error('Failed to delete book #' + bookId);
        throw error
      }
    )
  }

  findAndRemove(array, property, value) {
    array.forEach(function(result, index) {
      if(result[property] === value) {
        //Remove from array
        array.splice(index, 1);
      }    
    });
  }
}

export default App;
