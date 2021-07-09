const express = require('express');
const router = express.Router();
const taskService = require('./tasks.service');


const getAllTasks = (req, res, next) => {
    taskService.getAllTasks(req.query, req.currentUser)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const getTaskById = (req, res, next) => {
    taskService.getTaskById(req.params.id)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const testRandom = (req, res, next) => {
    taskService.testRandom()
        .then(task => res.json(task))
        .catch(err => next(err));
}

const addTask = (req, res, next) => {
    taskService.addTask(req.body, req.currentUser)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const approvedTask = (req, res, next) => {
    taskService.approvedTask(req.params.id, req.currentUser, true)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const rejectTask = (req, res, next) => {
    taskService.approvedTask(req.params.id, req.currentUser, false)
        .then(task => res.json(task))
        .catch(err => next(err));
}

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', addTask);
router.post('/approved/:id', approvedTask);
router.post('/reject/:id', rejectTask);



module.exports = router;