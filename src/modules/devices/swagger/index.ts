import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

export function DeviceSwagger(options: string) {
    let decorators: MethodDecorator[] | (MethodDecorator & ClassDecorator)[] = [ApiTags('Device')];
    if (options === 'Update Value')
        decorators = [
            ...decorators,
            ApiBody({
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            example: 'example@gmail.com'
                        },
                        password: {
                            type: 'string',
                            example: 'example'
                        }
                    }
                }
            }),
            ApiResponse({
                status: 200,
                description: 'Login successful',
                schema: {
                    type: 'object',
                    properties: {
                        is_on: {
                            type: 'boolean',
                            example: true
                        },
                        _id: {
                            type: 'string',
                            example: '611e8312dd6d80000b41d27f'
                        },
                        device_name: {
                            type: 'string',
                            example: 'Volume Level'
                        },
                        note: {
                            type: 'string',
                            example: 'note'
                        },
                        room: {
                            type: 'string',
                            example: '6110df9cc0f8625d347d0267'
                        },
                        cestron_device_id: {
                            type: 'string',
                            example: 'id'
                        },
                        device_type: {
                            type: 'number',
                            example: 1
                        },
                        current_value: {
                            type: 'number',
                            example: 1
                        },
                        max_value: {
                            type: 'number',
                            example: 10
                        },
                        min_value: {
                            type: 'number',
                            example: 0
                        }
                    }
                }
            }),
            ApiResponse({
                status: 400,
                description: 'Invalid email or password',
                schema: {
                    type: 'object',
                    properties: {
                        error_code: {
                            type: 'string',
                            example: '400'
                        },
                        error_message: {
                            type: 'string',
                            example: 'Invalid email or password'
                        }
                    }
                }
            })
        ];
    return applyDecorators(...decorators);
}
