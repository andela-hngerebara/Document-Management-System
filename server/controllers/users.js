import jwt from 'jsonwebtoken';
import { Users, Documents, Roles } from '../models';
import cfg from '../configs/config';
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync();

const usersController = {
  createUser(req, res) {
    return Users.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      roleId: 2
    })
      .then((user) => {
        const payload = {
          id: user.id,
          username: user.username,
          roleId: user.roleId
        };
        const token = jwt.sign(payload, cfg.jwtSecret, {
          expiresIn: 60 * 60 * 24
        });
        return res.status(201).send({
          message: 'User signed up succesfully',
          user,
          token
        });
      })
      .catch(errors =>
        res.status(400).send({
          message: 'User email or password already exists',
          errors
        })
      );
  },

  listAllUsers(req, res) {
    const limit = Number(req.query.limit) || 6;
    const offset = Number(req.query.offset) || 0;
    return Users.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Roles,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ]
    })
      .then((users) => {
        const next = Math.ceil(users.count / limit);
        const currentPage = Math.floor((offset / limit) + 1);
        const pageSize = limit > users.count ? users.count : limit;
        res.status(200).send({
          message: 'users successfully retrieved',
          pagination: {
            pageCount: next,
            page: currentPage,
            rowsPerPage: Number(pageSize),
            totalCount: users.count
          },
          users: users.rows
        });
      })
      .catch(error =>
        res.status(400).send({
          message: 'Users could not be retrieved',
          error
        })
      );
  },

  retrieveUser(req, res) {
    Users.findOne({
      where: {
        $or: [{ id: req.params.id }]
      }
    }).then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: `User with id ${req.params.id} does not exist` });
      }
      res.status(200).send({
        message: `User Found with id ${req.params.id} was found`,
        user
      });
    });
  },

  retrieveAll(req, res) {
    return Users.findById(req.params.creatorId, {
      include: [
        {
          model: Documents,
          as: 'allDocuments'
        }
      ]
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found'
          });
        }
        return res.status(200).send({
          message: 'Found user and retrieved documents',
          user
        });
      })
      .catch(error => res.status(400).send(error));
  },

  updateUser(req, res) {
    const queryId = req.params.id;
    const userId = req.user.id;
    let encryptedPassword;
    if (req.body.password) {
      encryptedPassword = bcrypt.hashSync(req.body.password, salt);
    } 
    if (parseInt(userId, 10) === parseInt(queryId, 10)) {
      return Users.findById(queryId)
    .then((user) => {
      user
        .update({
          userName: req.body.userName || user.username,
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
          email: req.body.email || user.email,
          password: encryptedPassword || user.password
        })
        .then(() =>
          res.status(200).send({
            message: 'User details updated',
            user
          })
        )
        .catch(error =>
          res.status(400).send({
            message: 'You had some erros updating your profile',
            error
          })
        );
    });
    }
    return res.status(403)
      .send({
        message: 'You have no rights to update this profile'
      });
  },

  destroyUser(req, res) {
    return Users.findById(req.params.id)
      .then((users) => {
        if (!users) {
          return res.status(404).send({
            message: 'The user cannot be found therefore cannot be deleted'
          });
        }
        return users
          .destroy()
          .then(() =>
            res.status(200).send({
              message: 'User deleted successfully.'
            })
          )
          .catch(error =>
            res.status(409).send({
              message: 'An error occured while attempting to delete user, Try again',
              error
            })
          );
      })
      .catch(error => res.status(400).send(error));
  },

  login(req, res) {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      Users.findOne({ where: { email } })
        .then((user) => {
          if (Users.IsPassword(user.password, password)) {
            const payload = {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              password: user.password,
              email: user.email,
              roleId: user.id
            };
            const token = jwt.sign(payload, cfg.jwtSecret, {
              expiresIn: 60 * 60 * 24
            });
            return res.send({
              message: 'Successfully signed in',
              token
            });
          }
          return res.status(401).send({
            message: 'Incorrect Password'
          });
        })
        .catch((errors) => {
          res.status(401).send({
            message: 'User not found',
            errors
          });
        });
      return;
    }
    return res.status(400).send({
      message: 'Enter a valid email and password'
    });
  },

  checkUsername(req, res) {
    const username = req.params.username;
    Users.findOne({ where: { username } }).then((user) => {
      if (user) {
        return res.status(400).send({
          message: 'username already exist'
        });
      }
      return res.status(200).send({
        message: 'successful'
      });
    });
  },

  logout(req, res) {
    return res.send({ message: 'You have succesfully logged out' });
  }
};

export default usersController;
