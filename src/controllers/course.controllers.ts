import { Request,Response,NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { sendSuccess } from "../utils/api-response";
import { tryCatch } from "../utils/try-catch";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema";
import { AppError } from "../utils/app-error";
import { AuthRequest } from "../middlewares/authenticate";

export async function getAllCourses(req: Request,res: Response,next: NextFunction){
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const instructorId = req.query.instructorId ? parseInt(req.query.instructorId as string) : undefined;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    const [courses,error] = await tryCatch(CourseService.findAll({page,limit,search,instructorId,minPrice,maxPrice}));
    
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

export async function createCourse(req: AuthRequest,res: Response,next: NextFunction){
    // Validating and then storing the input(req.body)
    const result = createCourseSchema.safeParse(req.body);

    if (!result.success) return next(new AppError(result.error.issues[0].message, 400));

    // Grab the id of logged in user
    const instructorId = req.user!.id;

    const [course,error] = await tryCatch(CourseService.create(instructorId,result.data));

    if(error) return next(error);
    return sendSuccess(res, course, "Course created successfully",201);
}

export async function updateCourse(req: AuthRequest,res: Response,next: NextFunction){
    const id = Number(req.params.id);
    const result = updateCourseSchema.safeParse(req.body);
    if (!result.success) return next(new AppError(result.error.issues[0].message, 400));

    const [updatedCourse,error] = await tryCatch(CourseService.update(id,result.data));

    if(error) return next(error);
    return sendSuccess(res,updatedCourse,"Course updated successfully");
}

export async function deleteCourse(req: AuthRequest,res: Response,next: NextFunction){ 
    const id = Number(req.params.id);
    const [delRes,error] = await tryCatch(CourseService.delete(id));

    if(error) return next(error);
    return sendSuccess(res,delRes,"Course deleted successfuly");
}