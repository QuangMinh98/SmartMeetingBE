import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly isOnlyAdmin: boolean) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { user } = req;

        if (this.isOnlyAdmin && !user.admin)
            throw new HttpException({ error_code: '401', error_message: 'unauthorized' }, 401);

        return true;
    }
}
