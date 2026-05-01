import { Router } from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/course.controllers';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

// Map each HTTP method + path → controller function
router.get('/',authenticate,getAllCourses);
router.get('/:id',authenticate, getCourseById);
router.post('/',authenticate, createCourse);
router.put('/:id',authenticate, updateCourse);
router.delete('/:id',authenticate, deleteCourse);

export default router;
