import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    platform: {
        type: String,
        required: true,
    },

    url: {
        type: String,
        required: true,
    },

    price: {
        type: String,
        default: 'Free',
    },

    rating: {
        type: Number,
        default: 0,
    },

    duration: {
        type: String,
        default: 'Unknown',
    },
}, {timestamps: true});

export default mongoose.model('Course', courseSchema);