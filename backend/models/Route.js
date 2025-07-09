const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    }
});

const routeSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: true
    },
    routeNumber: {
        type: String,
        required: true
    },
    busName: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    busStops: [{
        type: String,
        required: true
    }],
    startPoint: {
        type: String,
        required: true
    },
    endPoint: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    waypoints: [waypointSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Route', routeSchema);