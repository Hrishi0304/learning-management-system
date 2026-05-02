import pool from "../config/db-config";
import { CreateCourseInput, UpdateCourseInput } from "../schemas/course.schema";
import { AppError } from "../utils/app-error";
import { tryCatch } from "../utils/try-catch";

export interface CourseFilters{
    page?: number;
    limit?: number;
    search?: string;
    instructorId?: number;
    minPrice?: number;
    maxPrice?: number;
}

export class CourseService{

    static async findAll(filters: CourseFilters = {}){
        // Set defaults
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page-1)*limit;

        let sqlQuery = `
            SELECT 
            c.id,c.instructor_id,c.title,c.description,c.price,
            c.duration_hours,c.launched_date,c.is_published,
            c.created_at, 
            u.name AS instructor_name,
            u.email AS instructor_email 
            FROM courses c 
            JOiN users u on c.instructor_id=u.id
        `;

        const conditions: string[] = []; // for writing query
        const queryParams: any[] = []; // for sending query

        if(filters.search){
            conditions.push("c.title LIKE ?");
            queryParams.push(`%${filters.search}%`);
        }

        if(filters.instructorId){
            conditions.push("c.instructor_id = ?");
            queryParams.push(filters.instructorId);
        }

        if(filters.minPrice !== undefined){
            conditions.push("c.price >= ?");
            queryParams.push(filters.minPrice);
        }

        if(filters.maxPrice !== undefined){
            conditions.push("c.price <= ?");
            queryParams.push(filters.maxPrice);
        }

        if(conditions.length>0){
            sqlQuery += " WHERE " + conditions.join(" AND ");
        }

        sqlQuery += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit,offset);
        const [data,error] = await tryCatch(
            pool.query(sqlQuery,queryParams)
        );
        if(error){
            throw new AppError('Failed to fetch courses',500);
        }

        const [rows] = data as any;
        return rows;
    }

    static async findById(id: number){
        const [data,error] = await tryCatch(
            pool.query(`
                SELECT 
                c.id, c.title,c.description,c.price,
                c.duration_hours,c.instructor_id,c.launched_date,c.is_published,
                c.created_at, 
                u.name AS instructor_name,
                u.email AS instructor_email 
                FROM courses c 
                JOiN users u on c.instructor_id=u.id
                WHERE c.id = ? `
            ,[id])
        );

        if(error){
            throw new AppError('Failed to fetch course',500);
        }

        const [rows] = data as any;
        const course = rows[0];

        if(!course) throw new AppError('Course not found',404);
        return course;
    }

    static async create(instructorId: number,input: CreateCourseInput){
        const { title, description, price, duration_hours, is_published, launched_date } = input;

        const [data,error] = await tryCatch(
            pool.query(
                `INSERT INTO courses (instructor_id,title,description,price,duration_hours,is_published,launched_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [instructorId,title, description ?? null, price, duration_hours, is_published, launched_date ?? null]
            )
        );

        if(error) throw new AppError('Failed to create course',500);

        const [result] = data as any;
        // fetch and return the full created record 
        // this is used to indicate to api success
        return this.findById(result.insertId); 
    }

    static async update(id: number,input: UpdateCourseInput){
        //Check whether record with id really exist before proceeding inside function
        //throws 404 if not found
        await this.findById(id);

        //if input fields are empty or not?
        // returning array of keys to check whether we received keys or not
        const fields = Object.keys(input);
        if(fields.length===0) throw new AppError('No fields to update',400);

        // Build dynamic SET clause from only the fields provided
        // e.g. { title: "New", price: 99 } → "title = ?, price = ?"
        const setClause = fields.map(field => `${field} = ?`).join(',');

        // values + id at the end for WHERE
        const values = [...Object.values(input),id];

        const [,error] = await tryCatch(
            pool.query(`UPDATE courses SET ${setClause} WHERE id=?`,values)
        )

        if(error) throw new AppError("Failed to update course",500);

        return this.findById(id); // return the updated row
    }

    static async delete(id: number){
        //Check the existig record
        await this.findById(id);

        const [,error] = await tryCatch(
            pool.query('DELETE FROM courses WHERE id=?',[id])
        );

        if(error) throw new AppError('Failed to delete course',500);

        return {deleted: true, id};
    }
}