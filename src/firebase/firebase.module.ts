import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  providers: [FirebaseService]
})
export class FirebaseModule {}
