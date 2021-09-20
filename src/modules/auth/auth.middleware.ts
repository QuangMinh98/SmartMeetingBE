import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/config';
import { User } from '../users';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.header('x-auth-token');
        if (!token) throw new HttpException({ error_code: '401', error_message: 'unauthorized' }, 401);

        try {
            const payload = jwt.verify(token, config.jwtKey) as any;
            req.user = payload;
            req.body.user_created = req.body.user_updated = payload._id;
            req.body.created_time = req.body.updated_time = Date.now();

            const user = await User.findById(payload._id);
            if (!user) throw new HttpException({ error_code: '401', error_message: 'Invalid token' }, 401);

            next();
        } catch (ex) {
            console.log(ex.message);
            throw new HttpException({ error_code: '401', error_message: 'token expired' }, 401);
        }
    }
}
