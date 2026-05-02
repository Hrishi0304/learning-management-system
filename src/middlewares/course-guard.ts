import { NextFunction, Response } from "express";
import { AuthRequest } from "./authenticate";
import { AppError } from "../utils/app-error";
import { tryCatch } from "../utils/try-catch";
import { CourseService } from "../services/course.service";

export const checkCourseOwnership = async (req: AuthRequest,res:Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if(isNaN(id)) return next(new AppError('Invalid course ID',400));

    // 1. Fetch the course first to see who owns it.
    const [course, fetchError] = await tryCatch(CourseService.findById(id));
    if(fetchError) return next(fetchError);

    // 2. Check ownership! (Unless they are in admin)
    if(course.instructor_id !== req.user!.id && req.user!.role !== 'admin'){
        return next(new AppError("You can only edit your own courses",403));
    }
    
    next();
}