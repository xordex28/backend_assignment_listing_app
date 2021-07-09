const db = require('../utils/db');
const {
    Task
} = db;
const { ObjectId } = require('bson');
const { asyncForEach } = require('../utils/generalFunctions');
const { getAssignmentUserAproven } = require('../users/users.service');
const randT = require("rand-token");

const getAllTasks = async ({ pending, approved, rejected }, currentUser) => {
    console.log(pending);
    let query = {
        '$or': [
            { user: ObjectId(currentUser._id) },
            { answeredFor: ObjectId(currentUser._id) }
        ]
    };
    if (pending) {
        query = { ...query, approved: false, rejected: false };
    }

    if (approved) {
        query = { ...query, approved: true, rejected: false };
    }

    if (rejected) {
        query = { ...query, approved: false, rejected: true };
    }
    const allTasks = await Task.find(query);
    return allTasks;
}

const getTaskById = async (id) => {
    const task = await Task.findOne({ _id: ObjectId(id) });
    if (!task) {
        throw 'Task not found';
    }
    return task;
}

const addTask = async (task, user) => {
    let fieldsError = [];
    if (!('client' in task || task.client === '')) {
        throw 'Field client not defined';
    }
    task.client = ObjectId(task.client);

    if (!('category' in task || task.category === '')) {
        throw 'Field category not defined';
    }
    task.category = ObjectId(task.category);

    if (!('description' in task || task.description === '')) {
        throw 'Field description not defined';
    }

    task.user = ObjectId(user._id);

    if ('fields' in task) {
        task.fields.forEach(field => {
            let message = '';
            if (!('type' in field) || field.type === '') {
                message += `Field type not defined\n`;
            }
            if (!('name' in field) || field.name === '') {
                message += `Field name not defined\n`;
            }
            if (!('value' in field) || field.value === null || field.value === undefined) {
                message += `Field value not defined\n`;
            }

            if (message.length > 0) {
                fieldsError.push({ ...field, message });
            }
        });

        if (fieldsError.length > 0) {
            throw fieldsError;
        }
    }

    const newTask = new Task(task);

    await newTask.save((err) => {
        throw err;
    });

    return newTask;
}

const approvedTask = async (taskId, user, approvedTaskValue) => {
    const task = await Task.findOne({ _id: ObjectId(taskId) });
    if (!task) {
        throw 'Task not found';
    }

    if (!user.role.canSuper) {
        if (!user.role.canApprove) {
            throw 'User does not have permission to approve';
        }
        let approved = false;
        const permits = await getAssignmentUserAproven(user._id);
        for (let index = 0; (index < permits[0].permits.length && !approved); index++) {
            const permit = permits[0].permits[index];
            if (task.client.toString() === permit.client.toString()) {
                for (let indexCategory = 0; (indexCategory < permit.categories.length && !approved); indexCategory++) {
                    const category = permit.categories[indexCategory];
                    if (task.category.toString() === category.category.toString()) {
                        approved = true;
                    }
                }
            }
        }

        if (!approved) {
            throw 'User does not have permission to approve';
        }
    }
    if(approvedTaskValue){
        task.approved = true;
    }else{
        task.rejected = true;

    }
    task.answeredFor = ObjectId(user._id);

    let codings = randT.generate(16) + '$#@';
    let newCodeSecret = randT.generate(20, codings);
    let document = await Task.findOne({ 'codeValidator': newCodeSecret });
    while (document) {
        newCodeSecret = randT.generate(16);
        document = await Task.findOne({ 'codeValidator': newCodeSecret });
    }

    task.codeValidator = newCodeSecret;
    task.updatedDate = Date.now();

    await task.save((err) => {
        throw err;
    });
    return task;
}


const testRandom = async () => {
    let codings = randT.generate(16) + '$#@';
    let newCodeSecret = randT.generate(20, codings);
    let document = await Task.findOne({ 'codeValidator': newCodeSecret });
    while (document) {
        newCodeSecret = randT.generate(16);
        document = await Task.findOne({ 'codeValidator': newCodeSecret });
    }
    return newCodeSecret;
}

module.exports = {
    getAllTasks,
    getTaskById,
    testRandom,
    addTask,
    approvedTask
}