import { Request,Response,NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { sendSuccess } from "../utils/api-response";
import { tryCatch } from "../utils/try-catch";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema";
import { AppError } from "../utils/app-error";

export async function getAllCourses(req: Request,res: Response,next: NextFunction){
    const [courses,error] = await tryCatch(CourseService.findAll());
    if(error) return next(error);
    return sendSuccess(res, courses, 'Courses fetched successfully');
}

export async function getCourseById(req: Request,res: Response,next: NextFunction){
    const id = Number(req.params.id);
    if(isNaN(id)) return next(new AppError('Invalid course ID',400));

    const [course,error] = await tryCatch(CourseService.findById(id));
    if(error) return next(error);
    return sendSuccess(res, course, 'Course fetched successfully');
}

export async function createCourse(req: Request,res: Response,next: NextFunction){
    // Validating and then storing the input(req.body)
    const result = createCourseSchema.safeParse(req.body);

    if (!result.success) return next(new AppError(result.error.issues[0].message, 400));

    const [course,error] = await tryCatch(CourseService.create(result.data));

    if(error) return next(error);
    return sendSuccess(res, course, "Course created successfully",201);
}

export async function updateCourse(req: Request,res: Response,next: NextFunction){
    const id = Number(req.params.id);
    if(isNaN(id)) return next(new AppError('Invalid course ID',400));

    const result = updateCourseSchema.safeParse(req.body);
    if (!result.success) return next(new AppError(result.error.issues[0].message, 400));

    const [updatedCourse,error] = await tryCatch(CourseService.update(id,result.data));

    if(error) return next(error);
    return sendSuccess(res,updatedCourse,"Course updated successfully");
}

export async function deleteCourse(req: Request,res: Response,next: NextFunction){ 
    const id = Number(req.params.id);
    if(isNaN(id)) return next(new AppError('Invalid course ID',400));

    const [delRes,error] = await tryCatch(CourseService.delete(id));

    if(error) return next(error);
    return sendSuccess(res,delRes,"Course deleted sccessfuly");
}