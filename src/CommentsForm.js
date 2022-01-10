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
                <p>Add new comment: </p>
                {this.renderAddCommentForm()}
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
                        <button onClick={() => this.handleUpdateCommentButton()}>Update comment</button>
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

    renderAddCommentForm() {
        return (
            <div>
            {!this.state.showForm ?
            (
                <button onClick={() => this.showForm()}>Add comment</button>
            ) 
                :
            (
                <form>
                    <label htmlFor="message">Message:</label><br/>
                    <input type="text" id="message" name="message" 
                        value={this.state.message}
                        onChange={(event) => this.handleChangeMessage(event)}
                    />
                    <div>
                        <button id="submitButton" type="button" onClick={() => this.handleSubmit(this.state.commentId, this.state.message)}>Submit</button>
                    </div>
                </form>
            )}
            </div>
        )
      };

    handleSubmit(commentId, message) {
        if(message === "")
           return;

        var jsonData = {};
        jsonData["message"] = message;
        
        var json = JSON.stringify(jsonData, (key, value) => {
            if (value !== null) return value
          });

        if(commentId === null) {
            console.log(json);
            addComment(this.state.bookId, json);
            this.showForm();
            this.fetchComments();
        }
        else {
            // updateComment(id, json);
        }
    };

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