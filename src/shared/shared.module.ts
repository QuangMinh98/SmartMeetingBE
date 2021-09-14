import { Global, Module } from '@nestjs/common';
import { ThingworxService } from './services/thingworx.service';
import { FirebaseService } from './services/firebase.service';
import { ResponseService } from './services/response.service';
import { HelperService } from './services/helper.service';

const providers = [
    FirebaseService, 
    ResponseService, 
    ThingworxService, 
    HelperService
];

@Global()
@Module({
    providers,
    exports: providers
})
export class SharedModule {}
