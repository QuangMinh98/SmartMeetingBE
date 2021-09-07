import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/config'
import { User } from '../users'
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

@Injectable()
export class AuthMiddleware {

    async use(req: Request, res: Response, next: NextFunction){
        const token = req.header('x-auth-token')
        if (!token) 
        throw new HttpException({error_code: '401', error_message: 'unauthorized'}, 401)

        try {
            const payload = jwt.verify(token, config.jwtKey) as any
            req.user = payload;
            req.body.user_created = req.body.user_updated = payload._id
            req.body.created_time = req.body.updated_time = Date.now()

            const user = await User.findById(payload._id);
            if(!user) 
            throw new HttpException({error_code: '400', error_message: 'token expired'}, 400)

            const now = moment();
            const tokenCreateTime = moment(payload.iat * 1000);

            if (now.diff(tokenCreateTime, 'minutes') > 43200) 
            throw new HttpException({error_code: '400', error_message: 'token expired'}, 400)
            
            next();
        } catch (ex) {
            console.log(ex.message)
            throw new HttpException({error_code: '401', error_message: 'unauthorized'}, 401)
        }
    }

}