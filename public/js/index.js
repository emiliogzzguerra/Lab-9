const BOOK_API_KEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

const DEFAULT_OPTIONS =  {
    headers: {
        "book-api-key": BOOK_API_KEY,
    }
};

const errorHandler = err => {
    let errors = document.querySelector(".errors");
    errors.innerHTML = err.message;
}

const initialResponseHandler = (req, res) => {
    if (res.ok) {
        return res.json();
    }
    throw new Error( res.statusText );
}

const createBookmark = (bookmark) => {
    axios.post('/bookmarks',bookmark,  {
        headers: {
            "book-api-key": BOOK_API_KEY,
            Authorization: `Bearer ${BOOK_API_KEY}`
        },
        body: bookmark,
    }).then(res => {
        if (!res) {
            throw new Error( res.statusText );
        }
        return res;
    }).then(res => {
        populateBookmarks();
    }).catch(err => errorHandler(err))
}

const deleteBookmark = (id) => {
    axios.default.delete(`/bookmark/${id}`, DEFAULT_OPTIONS).then(response => {
        populateBookmarks();
    }).catch(err => errorHandler(err))
}

const updateBookmark = (event, id) => {
    const bookmark = {
        id: id,
        ...retrieveNewBookmarkData(event.target.parentElement.querySelector('form'))
    }
    axios.patch(`/bookmark/${bookmark.id}`, { id: bookmark.id, object: bookmark } , {
        headers: {
            "book-api-key": BOOK_API_KEY,
            Authorization: `Bearer ${BOOK_API_KEY}`
        },
    }).then(response => {
        if (!response) {
            throw new Error( res.statusText );
        }
        populateBookmarks();
    }).catch(err => errorHandler(err))
}

const editBookmark = (event, bookmark) => {
    let bookmarkContainer = event.target.parentElement;
    let saveButton = document.createElement('button');
    saveButton.innerHTML = "Update bookmark"
    saveButton.addEventListener('click', (event) => { updateBookmark(event, bookmark.id) })
    let cancelButton = document.createElement('button');
    cancelButton.innerHTML = "Cancel"
    cancelButton.addEventListener('click', () => { populateBookmarks(); })
    let separator = document.createElement('div');
    separator.setAttribute('class', 'separator');
    bookmarkContainer.innerHTML = `
        <h3>Editing "${bookmark.title}" bookmark ...</h3>
        <form id="create-bookmark">
            <label for="bookmark-title">Bookmark title:</label>
            <input id="bookmark-title" type="text" value="${bookmark.title}" />
            <label for="bookmark-description">Bookmark description:</label>
            <input id="bookmark-description" value="${bookmark.description}" type="text" />
            <label for="bookmark-url">Bookmark url:</label>
            <input id="bookmark-url" value="${bookmark.url}" type="text" />
            <label for="bookmark-rating">Bookmark rating:</label>
            <input id="bookmark-rating" value="${bookmark.rating}" type="number" />
        </form>
    `;
    bookmarkContainer.prepend(separator);
    bookmarkContainer.appendChild(saveButton);
    bookmarkContainer.appendChild(cancelButton);
}

const populateBookmarks = () => {
    axios.default.get('/bookmarks', {
        headers: {
            "book-api-key": BOOK_API_KEY,
        }
    }, (req, res) =>initialResponseHandler(req,res))
       .then(response => {
        let data = response.data;
        let results;
        results = document.querySelector(".results");
        results.innerHTML = '';
        for(let i = data.length - 1; i>=0; i--) {
            let bookmark = data[i];
            let deleteButton, editButton, separator;
            deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete bookmark';
            deleteButton.addEventListener('click', () => { deleteBookmark(bookmark.id) });
            editButton = document.createElement('button');
            editButton.innerHTML = 'Edit bookmark';
            editButton.addEventListener('click', (event) => { editBookmark(event, bookmark) });
            separator = document.createElement('div');
            separator.setAttribute('class', 'separator');
            bookmarkContainer = document.createElement('div');
            bookmarkContainer.setAttribute('id', bookmark.id);
            bookmarkContainer.innerHTML = `
                <a href="${bookmark.url}"><h3>${bookmark.title}</h3></a>
                <p>Description: ${bookmark.description}</p>
                <p>Rating (out of 5): ${bookmark.rating}</p>
            `;
            bookmarkContainer.appendChild(deleteButton);
            bookmarkContainer.appendChild(editButton);
            bookmarkContainer.prepend(separator);
            results.appendChild(bookmarkContainer);
        }
    }).catch(err => errorHandler(err))
}

const retrieveNewBookmarkData = (formElement) => {
    const title =  formElement.querySelector("#bookmark-title").value || null;
    const description =  formElement.querySelector("#bookmark-description").value || null;
    const url =  formElement.querySelector("#bookmark-url").value || null;
    const rating =  formElement.querySelector("#bookmark-rating").value || null;

    if (title == null || description == null || url == null || rating == null) {
        errorHandler(new Error("There's a missing field"));
    } else {
        return bookmark = {
            title: formElement.querySelector("#bookmark-title").value,
            description: formElement.querySelector("#bookmark-description").value,
            url: formElement.querySelector("#bookmark-url").value,
            rating: formElement.querySelector("#bookmark-rating").value,
        }
    }
}

window.addEventListener('load', function () {
    populateBookmarks();
    const createBookmarkForm = document.querySelector("#create-bookmark");

    createBookmarkForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const bookmark = retrieveNewBookmarkData(event.target.parentElement);
        createBookmark(bookmark)
    })

})