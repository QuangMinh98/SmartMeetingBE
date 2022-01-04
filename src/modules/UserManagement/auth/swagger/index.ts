import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

export function AuthSwagger() {
    return applyDecorators(
        ApiTags('Auth'),
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
            description: 'Login successful'
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
    );
}
