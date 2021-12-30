import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';

export function RoleMiddleware(moduleName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = req;

        if (!user.role && !user.admin)
            throw new HttpException({ error_code: '401', error_message: 'Unauthorize' }, 401);

        console.log(user.role && !user.admin && !user.role.modules.includes(moduleName));

        if (user.role && !user.admin && !user.role.modules.includes(moduleName))
            throw new HttpException({ error_code: '401', error_message: 'Unauthorize' }, 401);

        next();
    };
}
