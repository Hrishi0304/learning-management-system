import { Router } from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/course.controllers';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { checkCourseOwnership } from '../middlewares/course-guard';

const router = Router();

// Map each HTTP method + path → controller function
router.get('/',authenticate,getAllCourses);
router.get('/:id',authenticate, getCourseById);
router.post('/',authenticate,authorize('admin','instructor'), createCourse);
router.put('/:id',authenticate,checkCourseOwnership, updateCourse);
router.delete('/:id',authenticate,checkCourseOwnership, deleteCourse);

export default router;
