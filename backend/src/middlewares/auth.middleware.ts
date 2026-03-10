import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import { Role } from '../types/enum.types';
import { verifyToken } from '../utils/jwt.utils';
import CustomError from './error-handler.middleware';

export const authenticate = (roles?: Role[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. token 
            // 2. validate 
            // 3. role


            // Get token from cookies
            const access_token = req.headers['x-access-token'];
            console.log("accesstoken => ", access_token)
            if (!access_token || typeof access_token !== 'string') {
                throw new CustomError('Token is missing ', 401);
            }

            // Verify token
            const decodedData = verifyToken(access_token);

            console.log("decode data => " , decodedData);

            

            const user = await User.findById(decodedData._id);

            if (!user) {
                throw new CustomError('User is not found ', 401);
            }

            if (roles && !roles.includes(decodedData.role)) {
                throw new CustomError('Role is authorized', 403);
            }

            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                role: decodedData.role,
                fullName: decodedData.fullName
            };

            next();

        } catch (error) {
            next(error);
        }
    };
};
