import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDocument, createDocument } from './DocumentActions';
import DocumentForm from './DocumentForm';
import SideBar from '../common/SideBar';
import toastr from 'toastr';
import Header from '../common/Header';

class ManageDocumentsPage extends Component {
  constructor(props, context) {
    super(props, context);
    const document = {
      id: null,
      documentName: '',
      description: '',
      access: 'public',
      content: '' 
    }
    this.state = {
      document: this.props.document || document,
      errors: {},
      saving: false
    };
    this.updateDocumentState = this.updateDocumentState.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
  }

componentDidMount() {
  const { params: { id } } = this.props;
  const documentId = this.props.document.id;
  if (id && id !== 'new' && !documentId) {
    this.props.fetchDocument(id)
    .catch((error) => {
        toastr.error(error);
     });
  }
}
  componentWillReceiveProps(nextProps) {
    if (this.props.document.id != nextProps.document.id) {
      this.setState({
        document: Object.assign({}, nextProps.document) });
    }
  }

  updateDocumentState(event) {
    const field = event.target.name;
    const document = {
      ...this.state.document,
      [field]: event.target.value
    };
    return this.setState({ document });
  }
  
  saveDocument(event) {
    event.preventDefault();
    this.setState({ saving: true });
      this.props.createDocument(this.state.document)
      .then(() => this.redirect())
      .catch((error) => {
        toastr.error(error);
        this.setState({ saving: false });
      });
  }

  redirect() {
    this.setState({ saving: false });
    toastr.success('Document saved');
    this.context.router.push('/documents');
  }

   handleEditorChange = (e) => {
     const content = e.target.getContent();
     const document = {
       ...this.state.document,
       content,
     }
     this.setState({ document });
  }

  render() {
    return (
      <div>
       <Header />
      <main>
        <div className="container">
      <div className="row">
      <SideBar />
      <DocumentForm
        onChange={this.updateDocumentState}
        handleEditorChange={this.handleEditorChange}
        onSave={this.saveDocument}
        document={this.state.document}
        errors={this.state.errors}
        saving={this.state.saving}
      />
      </div>
      </div>
      </main>
      </div>
    );
  }
}

ManageDocumentsPage.propTypes = {
  document: PropTypes.object.isRequired,
};

ManageDocumentsPage.contextTypes = {
  router: PropTypes.object
};

const getDocumentById = (documents, id) =>
  documents.find(doc => String(doc.id) === id);

function mapStateToProps({ DocumentReducer }, ownProps) {
  const documentId = ownProps.params.id;

  let document = { id: null, documentName: '', description: '', access: 'public', content: '' };

  if (documentId && DocumentReducer.documents) {
    const foundDocument = getDocumentById(DocumentReducer.documents, documentId);
    document = foundDocument || document;
  }

  return {
    document,
  };
}

const mapDispatchToProps = {
  fetchDocument,
  createDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDocumentsPage);