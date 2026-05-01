import pool from "../config/db-config";
import bcrypt from 'bcryptjs';
import jwt  from "jsonwebtoken";

import { LoginInput, SignupInput } from "../schemas/user.schema";
import { AppError } from "../utils/app-error";
import { tryCatch } from "../utils/try-catch";

export class UserService{
    static async signup(input: SignupInput){
        const { name, email, role, password } = input;

        // 1. Checking already existed user
        const [existingUser, existErr] = await tryCatch(
            pool.query('SELECT * FROM users WHERE email=?',[email])
        );
        if(existErr) throw new AppError("Signup failed!",500);

        const [existRows] = existingUser as  any;
        if(existRows[0]) throw new AppError("Email already in use",409);
        // 409 Conflict — resource already exists
        
        // 2. Hash the password
        const [hash,hashError] = await tryCatch(
            bcrypt.hash(password,10)
        );
        if(hashError) throw new AppError("Signup failed!",500);

        // 3. Take the hash and use to insert user into db
        const [data,insertErr] = await tryCatch(
            pool.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)',[name,email,hash,role])
        );

        if(insertErr) throw new AppError("Signup failed!",500);

        const [result] = data as any;

        return {id:result.insertId, name, email, role}
    }

    static async login(input: LoginInput){
        const { email, password} = input;

        // 1. Checking user exists in db or not
        const [existingUser,existErr] = await tryCatch(
            pool.query("SELECT * FROM users WHERE email=?",[email])
        );
        if(existErr) throw new AppError("Login failed!",500);
        const [rows] = existingUser as any;
        const user = rows[0];

        // 2. Same message for "not found" AND "wrong password" — security!
        if (!user) throw new AppError('Invalid credentials', 401);

        // 3. Compare password with stored hash
        const [isMatch,compareErr] = await tryCatch(
            bcrypt.compare(password,user.password_hash)
        );

        if(compareErr) throw new AppError("Login Failed",500);
        if(!isMatch) throw new AppError('Invalid credentials', 401);

        //4. isMatch - true -> Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // 5 Return token + user (always without password)
        const { password_hash, ...userWithoutPassword} = user;
        return {token, user: userWithoutPassword};
    }
}