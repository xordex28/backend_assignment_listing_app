const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Model Role
const modelRole = new Schema({
    description: {
        type: String,
        required: true
    },
    canApprove: {
        type: Boolean,
        default: false
    },
    permits: [{
        client: {
            type: Schema.Types.ObjectId,
            required: true
        },
        categories: [{
            category: {
                type: Schema.Types.ObjectId,
                required: true
            },
            canApprove: {
                type: Boolean,
                default: false
            }
        }]
    }],
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: true
    }
});

// TODO: Model User
const modelUser = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'modelRole',
        required: true
    },
    permits: [{
        client: {
            type: Schema.Types.ObjectId,
            required: true
        },
        categories: [{
            category: {
                type: Schema.Types.ObjectId,
                required: true
            },
            canApprove: {
                type: Boolean,
                default: false
            }
        }]
    }],
    loggedIn: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', modelUser);
const Role = mongoose.model('Role', modelRole);

module.exports = {
    User: User,
    Role: Role
}