import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';

export function Admin(isOnlyAdmin: boolean) {
    const decorators: (MethodDecorator | ClassDecorator | PropertyDecorator)[] = [
        UseGuards(new AdminGuard(isOnlyAdmin))
    ];
    return applyDecorators(...decorators);
}
