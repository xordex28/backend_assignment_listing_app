const express = require('express');
const router = express.Router();
const userService = require('./users.service');

//TODO: Routes for Role
const getAllRoles = (req, res, next) => {
    userService.getAllRoles()
        .then(roles => res.json(roles))
        .catch(err => next(err));
}

const getRoleById = (req, res, next) => {
    userService.getRoleById(req.params.id)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const addRole = (req, res, next) => {
    userService.addRole(req.body)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const updateRole = (req, res, next) => {
    userService.updateRole(req.params.id, req.body)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const deleteRole = (req, res, next) => {
    userService.deleteRole(req.params.id)
        .then(role => res.json(role))
        .catch(err => next(err));
}

//TODO: Routes for User
const getAllUsers = (req, res, next) => {
    userService.getAllUsers()
        .then(users => res.json(users))
        .catch(err => next(err));
}

const getUserById = (req, res, next) => {
    userService.getUserById(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const addUser = (req, res, next) => {
    userService.addUser(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const updateUser = (req, res, next) => {
    userService.updateUser(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const deleteUser = (req, res, next) => {
    userService.deleteUser(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

router.get('/roles/', getAllRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles/', addRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

router.get('/users/', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users/', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;