import React from "react";
import ReactDOM from 'react-dom';
import "./App.css";
import {getComments, addComment, editComment, deleteComment} from './service';
import App from "./App";

class CommentsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          book: props.book,
          bookId: props.book.id,
          comments: [],
          commentId: null,
          message: "",
          showForm: false,
        };
      }

    componentDidMount() {
        this.fetchComments();
    }

    fetchComments() {
        const promice = getComments(this.state.bookId);
        promice.then(
          (result) => {
            this.setState({
              isLoaded: true,
              comments: result ? result : [],
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error: error
            });
          }
        )
        return this.state.comments;
    }

    render() {
        const { error, isLoaded, comments } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
            <div>
            <table>
              <caption>
                  {this.state.showForm ? 
                  (
                      <form>
                        <label htmlFor="message">Message:</label><br/>
                        <input type="text" id="message" name="message" 
                            value={this.state.message}
                            onChange={(event) => this.handleChangeMessage(event)}
                        />
                        <div>
                            <button id="submitButton" type="button" onClick={() => this.handleSubmit(this.state.message)}>Submit</button>
                        </div>
                      </form>
                  ) : (
                      <div>
                        <p>Add new comment: </p>
                        <button onClick={() => this.handleAddCommentButton()}>Add comment</button>
                      </div>
                  )
                  }
              </caption>
              <tbody>
                <tr>
                  <th>id</th>
                  <th>message</th>
                  <th>date</th>
                </tr>
                {comments.map(comment => (
                    <tr key={comment.id}>
                      <td>{comment.id}</td>
                      <td>{comment.message}</td>
                      <td>{comment.dateTime}</td>
                      <td>
                        <button onClick={() => this.handleUpdateCommentButton(comment.id)}>Update comment</button>
                        <button onClick={() => this.handleDeleteButton(comment.id)}>Delete comment</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <br/>
            <br/>
            <button onClick={() => this.return()}>Return to library</button>
            </div>   
          );
        }
    }

    handleSubmit(message) {
        if(message === "")
           return;

        var jsonData = {};
        jsonData["message"] = message;
        
        var json = JSON.stringify(jsonData, (key, value) => {
            if (value !== null) return value
          });

        if(this.state.commentId != null) {
          editComment(this.state.bookId, this.state.commentId, json)
          .then (
            this.setState({
              comments: this.fetchComments(),
              showForm: false,
            })
          )
        }
        else {
          addComment(this.state.bookId, json)
          .then (
            this.setState({
              comments: this.fetchComments(),
              showForm: false,
            })
          )
        }
    };

    handleAddCommentButton() {
      this.setState({
        commentId: null,
        showForm: true,
      });
    }

    handleUpdateCommentButton(commentId) {
      this.setState({
        commentId: commentId,
        showForm: true,
      });
    }

    handleDeleteButton(commentId) {
      deleteComment(commentId);
      const newComments = this.state.comments.filter(c => c.id !==commentId);
      this.setState({
        comments: newComments,
      });
    }

    handleChangeMessage(event) {
        this.setState({
            message: event.target.value,
          });
    };

    showForm() {
        this.setState({
            showForm: !this.state.showForm,
        });
    }

    return() {
        ReactDOM.render(
          <App/>,
          document.getElementById('root')
        );
    }
}

export default CommentsForm;