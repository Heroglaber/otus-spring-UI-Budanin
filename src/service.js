import axios from "axios";

export function fetchBooks() {
    const promice = axios.get("/book")
        .then(res => res.data);
    return promice;
}

export function getBook(bookId) {
    const promice = axios.get("/book/" + bookId)
        .then(res => res.data);
    return promice;
}

export function deleteBook(bookId) {
    const promice = axios.delete("/book/" + bookId)
        .then(res => res.data);
    return promice;
}

export function addBook(json) {
    const promice = axios.post("/book", json, {
        headers: {
            'Content-Type': 'application/json'
          }
    });
    return promice;
}

export function editBook(bookId, json) {
    const promice = axios.post("/book/" + bookId, json, {
        headers: {
            'Content-Type': 'application/json'
          }
    });
    return promice;
}