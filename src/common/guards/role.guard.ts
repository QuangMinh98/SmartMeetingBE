import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly model: string, private readonly action: string) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        let permissions = [];
        const { user } = req;

        // Admin user can access any request
        if (user.admin) return true;
        if (this.model == 'admin') throw new HttpException({ error_code: '401', error_message: 'unauthorized' }, 401);

        // If the user is not an administrator and does not have any permissions,
        // an error will be returned to the user
        if (!user.roles || user.roles.length === 0) {
            throw new HttpException({ error_code: '401', error_message: 'unauthorized' }, 401);
        }

        // Get all permissions of this user
        user.roles.forEach((role) => {
            if (role.permissions.length > 0) {
                permissions = permissions.concat(role.permissions);
            }
        });

        // Search in the permission list of the user whether the permission matches the model and permisssion variable
        // If the right permissions are not available, an error will be returned to the user
        // if it has the right permissions, user can access this request
        const allow = permissions.find(
            (permission) => permission.model == this.model && permission.permissions[this.action]
        );
        if (!allow) {
            throw new HttpException({ error_code: '401', error_message: 'unauthorized' }, 401);
        }

        return true;
    }
}
