const db = require('../utils/db');
const { ObjectId } = require('bson');
const crypto = require('crypto')

const {
    User,
    Role
} = db;

// TODO: Events for Model Role

const getAllRoles = async () => {
    return await Role.find({});
}

const getRoleById = async (id) => {
    const currentRole = await Role.findOne({ _id: bson.ObjectId(id) });
    if (!currentRole) {
        throw 'Role not found';
    }
    return currentRole;
}

const addRole = async (role) => {
    if (!('description' in role)) {
        throw 'Field description not defined';
    }
    const newRole = new Role(role);
    await newRole.save((err) => {
        throw err;
    });
    return newRole;
}

const updateRole = async (id, role) => {
    const currentRole = await Role.findOne({ _id: bson.ObjectId(id) });
    if (!role) {
        throw 'Role not found';
    }
    role.updatedDate = Date.now();
    Object.assign(currentRole, role);
    await currentRole.save((err) => {
        throw err;
    });
    return currentRole
}

const deleteRole = async (id) => {
    const currentRole = await Role.findOne({ _id: ObjectId(id) });
    if (!currentRole) {
        throw 'Role not found';
    }
    const usersOnRole = await User.find({ role: id });
    if(usersOnRole.length > 0){
        throw 'Cannot be deleted as there are users with the role';
    }
    const response = await Role.deleteOne({ _id: ObjectId(id) });
    return response;
}

// TODO: Events for Model User

const getAllUsers = async () => {
    return await User.find({}, {
        "username": 1,
        "firstName": 1,
        "lastName": 1,
        "loggedIn": 1,
        "role": 1,
        "active": 1
    }).populate("role");
}

const getUserById = async (id) => {
    const currentUser = await User.findOne({ _id: ObjectId(id) }, {
        "username": 1,
        "firstName": 1,
        "lastName": 1,
        "loggedIn": 1,
        "role": 1,
        "active": 1

    }).populate('role');

    if (!currentUser) {
        throw 'User not found';
    }

    return currentUser;
}

const addUser = async (user) => {

    //Validate the username
    if (!('username' in user) && user.username !== '') {
        throw 'Field Username not defined';
    }
    const username = user.username.trim().toLowerCase();
    if (
        await User.findOne({ username: username })
    ) {
        throw 'Username ' + username + ' is already exist';
    }
    user.username = username;

    //Validate the Role
    if (!('role' in user) && user.role !== '') {
        throw 'Field Role not defined';
    }
    if (!(await Role.findOne({ _id: ObjectId(user.role) }))) {
        throw 'the role does not exist';
    }
    user.role = ObjectId(user.role);

    //Validate the Password
    if (!('password' in user) && user.password !== '') {
        throw 'Field Password not defined';
    }
    user.hash = user.password;
    delete user.password;

    //Validate the FirstName
    if (!('firstName' in user) && user.firstName !== '') {
        throw 'Field FirstName not defined';
    }

    //Validate the LastName
    if (!('lastName' in user) && user.lastName !== '') {
        throw 'Field LastName not defined';
    }

    const newUser = new User(user);
    await newUser.save((err) => {
        throw err;
    });

    return newUser;
}

const updateUser = async (id, user) => {
    //Validate if user exists
    const currentUser = await User.findOne({ _id: ObjectId(id) });
    if (!currentUser) {
        throw 'Username does not exist';
    }

    //Validate the Username
    if ('username' in user) {
        throw 'Field username cannot be modified';
    }

    //Validate the Password
    if (('password' in user) && user.password !== '') {
        user.hash = user.password;
        delete user.password;
    }

    Object.assign(currentUser, user);
    await currentUser.save((err) => {
        throw err;
    });

    return currentUser;
}


const deleteUser = async (id) => {
    const currentUser = await User.findOne({ _id: ObjectId(id) });
    if (!currentUser) {
        throw 'User not found';
    }
    const response = await User.deleteOne({ _id: ObjectId(id) });
    return response;
}

module.exports = {
    getAllRoles,
    getRoleById,
    addRole,
    updateRole,
    deleteRole,

    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
}