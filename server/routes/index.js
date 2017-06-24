import express from 'express';
import usersController from '../controllers/users';
// import rolesController from '../controllers/roles';
import documentsController from '../controllers/documents';
import searchController from '../controllers/search';
import auth from '../config/middlewares/auth';

const authMiddleware = auth();
const router = express.Router();

// signup and list users routes
router
  .route('/users')
  .all(authMiddleware.authenticate())
  .post(usersController.create)
  .get(usersController.list);

// signin
router.post('/users/login', usersController.login);

// retrieve, delete and update user by id enpoints
router
  .route('/users/:id')
  .all(authMiddleware.authenticate())
  .get(usersController.retrieve)
  .put(usersController.update)
  .delete(usersController.destroy);

// create and retrieve documents by creator's id endpoint
router
.route('/users/:creatorId/documents')
.all(authMiddleware.authenticate())
.post(documentsController.create)
.get(usersController.retrieveAll);

// Get all documents and create documents route
router
  .route('/documents')
  .all(authMiddleware.authenticate())
  .get(documentsController.list)
  .post(documentsController.create);

// retrieve, update and delete documents by id endpoints
router
  .route('/documents/:id')
  .all(authMiddleware.authenticate())
  .get(documentsController.retrieve)
  .put(documentsController.update)
  .delete(documentsController.destroy);


// search documents
router.get('/search/documents',
authMiddleware.authenticate(),
searchController.searchDocuments);


// retrieve and create roles endpoint
// only accesible by admin
// router
// .route('/roles')
// .all(authMiddleware.authenticate())
// // .post('/roles', rolesController.create)
// .get('/roles', rolesController.list)

export default router;
