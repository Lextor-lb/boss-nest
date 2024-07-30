// src/firebase-admin/firebase-admin.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
    constructor(private readonly configService: ConfigService) {
        const firebaseConfig = {
          type: this.configService.get<string>('TYPE'),
          projectId: this.configService.get<string>('PROJECT_ID'),
          privateKeyId: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
          privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          clientId: this.configService.get<string>('FIREBASE_CLIENT_ID'),
          authUri: this.configService.get<string>('FIREBASE_AUTH_URI'),
          tokenUri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
          authProviderX509CertUrl: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
          clientC509CertUrl: this.configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL'),
        };
        
        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
          });
        }   
      }

      async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        return admin.auth().verifyIdToken(idToken);
      }
}





