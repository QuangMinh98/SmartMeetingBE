import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs'

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private readonly model: string, private readonly action: string) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        if(req.user.admin) return true;
        if(this.model == "admin") throw new HttpException({error_code: "401", error_message: "unauthorized"}, 401)

        let permissions = [];

        let { user } = req


        if (!user.roles || user.roles.length === 0) {
            throw new HttpException({error_code: "401", error_message: "unauthorized"}, 401)
        }

        user.roles.forEach(role => {
            if (role.permissions.length > 0) {
                permissions = permissions.concat(role.permissions)
            }
        })

        const allow = permissions.find(permission => permission.model == this.model && permission.permissions[this.action])
        if (!allow) {
            throw new HttpException({error_code: "401", error_message: "unauthorized"}, 401)
        }

        return true
    }
}