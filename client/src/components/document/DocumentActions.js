import axios from 'axios';

const ROOT_URL = 'http://localhost:8090';

export const FETCH_DOCUMENTS_SUCCESS = 'FETCH_DOCUMENTS_SUCCESS';
export const DISPLAY_FAILURE_MESSAGE = 'DISPLAY_FAILURE_MESSAGE';
export const CREATE_DOCUMENT_SUCCESS = 'DELETE_DOCUMENT_SUCCESS';
export const DELETE_DOCUMENT_SUCCESS = 'DELETE_DOCUMENT_SUCCESS';
export const FETCH_DOCUMENT_SUCCESS = 'FETCH_DOCUMENT_SUCCESS';
export const UPDATE_DOCUMENT_SUCCESS = 'UPDATE_DOCUMENT_SUCCESS';
export const DOCUMENT_FETCHED = 'DOCUMENT_FETCHED';

export const fetchDocumentsSuccess = documents => ({
  type: FETCH_DOCUMENTS_SUCCESS,
  documents
});

export const displayFailureMessage = errorMessage => ({
  type: DISPLAY_FAILURE_MESSAGE,
  errorMessage
});

export const fetchAllDocuments = () => (dispatch) => {
  axios.get(`${ROOT_URL}/documents`)
  .then((response) => {
    dispatch(fetchDocumentsSuccess(response.data));
  })
  .catch((error) => {
    dispatch(displayFailureMessage(error.response.statusText));
    throw error;
  });
};

export const createDocumentSuccess = document => ({
  type: CREATE_DOCUMENT_SUCCESS,
  document,
});

export const createDocument = document => dispatch =>
axios.post(`${ROOT_URL}/documents`, document)
 .then((response) => {
   dispatch(createDocumentSuccess(response.data));
 })
  .catch((error) => {
    dispatch(displayFailureMessage(error.response.statusText));
    throw error;
  });


export const deleteDocumentSuccess = document => ({
  type: DELETE_DOCUMENT_SUCCESS,
  document,
});

export const deleteDocument = documentId => (dispatch) => {
  axios.delete(`${ROOT_URL}/documents/${documentId}/`)
    .then((response) => {
      dispatch(deleteDocumentSuccess(response.data.message));
      dispatch(fetchAllDocuments());
    })
  .catch((error) => {
    dispatch(displayFailureMessage(error.response.data.message));
  });
};

// export const fetchDocumentSuccess = document => ({
 
//   type: FETCH_DOCUMENT_SUCCESS,
//   document
// });

// export const fetchDocument = documentId => (dispatch) => {
//    console.log('gettinghere')
//   axios.get(`${ROOT_URL}/documents/${documentId}`)
//   .then((response) => {
//     dispatch(fetchDocumentSuccess(response.data.document));
//   })
//   .catch((error) => {
//     dispatch(displayFailureMessage(error.response.data.message));
//     throw error;
//   });
// };

export const editDocumentSuccess = document => ({
  type: EDIT_DOCUMENT_SUCCESS,
  document
});

export const editDocument = (document) => (dispatch) => {
  axios.put(`${ROOT_URL}/documents/${document.id}/`, document)
      .then((response) => {
        resolve(dispatch(editDocumentSuccess(response.data)));
      })
      .catch((error) => {
        console.log("error response action", error.response)
        dispatch(displayFailureMessage(error.response));
        throw error;
      });
};

export const documentFetched = document => ({
  type: DOCUMENT_FETCHED,
  document
});

export const fetchDocument = (document) => (dispatch) => {
  axios.put(`${ROOT_URL}/documents/${document.id}/`)
      .then((response) => {
        resolve(dispatch(documentFetched(response.document)));
      })
      .catch((error) => {
        dispatch(displayFailureMessage(error.response.statusText));
        throw error;
      });
};
