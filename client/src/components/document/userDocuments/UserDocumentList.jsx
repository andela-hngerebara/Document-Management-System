import React, { PropTypes } from 'react';
import UserDocumentListRow from './UserDocumentListRow';

const UserDocumentList = ({ userDocuments, user, deleteDocument, viewDocument }) => {
  return (
    <div>
      <main>
        <div className="container">
          {userDocuments.map(document =>
            <UserDocumentListRow
              key={document.id}
              document={document}
              user={user}
              deleteDocument={deleteDocument}
              viewDocument={viewDocument}
            />)}
        </div>
      </main>
    </div>
  );
};

UserDocumentList.propTypes = {
  userDocuments: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  viewDocument: PropTypes.func.isRequired
};

export default UserDocumentList;
