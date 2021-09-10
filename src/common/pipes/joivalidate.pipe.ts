import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new HttpException(error.details[0].message, 400);
    }
    return value;
  }
}
