import pool from "../config/db-config";
import { CreateCourseInput, UpdateCourseInput } from "../schemas/course.schema";
import { AppError } from "../utils/app-error";
import { tryCatch } from "../utils/try-catch";

export class CourseService{

    static async findAll(){

        const [data,error] = await tryCatch(
            pool.query('SELECT * FROM courses ORDER BY created_at DESC')
        );

        if(error){
            throw new AppError('Failed to fetch courses',500);
        }

        const [rows] = data as any;
        return rows;
    }

    static async findById(id: number){
        const [data,error] = await tryCatch(
            pool.query('SELECT * FROM courses WHERE id = ? ',[id])
        );

        if(error){
            throw new AppError('Failed to fetch course',500);
        }

        const [rows] = data as any;
        const course = rows[0];

        if(!course) throw new AppError('Course not found',404);
        return course;
    }

    static async create(input: CreateCourseInput){
        const { title, description, price, duration_hours, is_published, launched_date } = input;

        const [data,error] = await tryCatch(
            pool.query(
                `INSERT INTO courses (title,description,price,duration_hours,is_published,launched_date) VALUES (?, ?, ?, ?, ?, ?)`,
                [title, description ?? null, price, duration_hours, is_published, launched_date ?? null]
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

        return this.findById(id); // return the updated ro
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