import Course from '../models/Course.js';
import User from '../models/User.js';
import { scrapeCourses } from '../utils/webScraper.js';

// Fetches all available courses from db
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetches recommended courses on users' interests and skills
export const getRecommendedCourses = async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { skills, interests } = user;

        // Check if user has added skills or interests
        if(skills.length === 0 && interests.length === 0) {
            return res.status(400).json({ message: 'Please add skills or interests for better recommendations.' });
        }

        // Find courses based on user's skills and interests
        const recommendations = await Course.find({
            $or: [
                { title: {regex: skills.join('|'), $options: 'i'} },
                { title: {regex: interests.join('|'), $options: 'i'} }
            ],
    });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Scrape courses from the web and save them to db
export const scrapeAndSaveCourses = async (req, res) => {
    try {
        const scrapedCourses = await scrapeCourses();

        // Remove old courses
        await Course.deleteMany();

        // Save new courses
        await Course.insertMany(scrapedCourses);

        res.json({ message: 'Courses updated successfully', scrapedCourses });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 