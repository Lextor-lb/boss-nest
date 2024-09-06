// src/firebase-admin/firebase-admin.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
    constructor(private readonly configService: ConfigService) {


        const firebaseConfig = {
          type: "service_account",
          projectId: "boss-auth123456789",
          privateKeyId: "df6007fc3dd6ed9f93a97503c3946d10547b8f65",
          privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCp4TCKfhHXL7XR\nkw4v7+RHT/0JtQcZlWcVJDZ/chMWpPhiQIrtbsKBTOdoFcYw9oqRf2Npy0ZsXgJ8\nbxVE8dRJKO1r36xDa094q4+z3GJnG11oS0Da9YeHsTDYHsUBY/HWqDyVTtd6Nx72\nVGz+qtDBSWhFSnBYNdDnEH++O7YBhsfZ3r/EH17ByO5QxyQ3mUdi71Y913yfgh+/\nq4C2y3oIMKS+tIa1Ono0awlgK98iB97hrACCMugy10W5V+SXAHSFjrDKWG08N3Ly\ncUdEhTfE6MvkJ0i9lg3fgmssCZQ1pG7PZ5SDCAe9fsGcoL4T69Fx8ZJtJzDn1mIL\nqWF+1gtNAgMBAAECggEAMy7DYr6oHmbkB3AgkqXa5/d8HAwcRwOCCtcdylky0hxD\nL8sVcILx/GYQxIXm8EKfrkWszKevoJ/UbOxFAsA/vwkjO2CpNKjkyU0bX0vzo/AV\nPQKLWE0ol+P1fPAMWCZmK1AF7NBT0KFB5WK7ciFCAzJcRaAvaAxS1ANfEZBI/n1A\n+fyayoCvUJvpe+aZkAzJEN74gIU3CHKcd+Ty6pgmgJ/bhPgfrZ9nPZ1fV05l/mHW\nWxIL4DXz2g6/xFsmfTeth59eYfHdVNn1ERaeYUIKsHHx22tuwZzcJ9b2vayxb0UV\ncRo3g2n0tZO2lioBarvfzuZKcc2Etxbqj+9YXGiCCwKBgQDZ1p06p6zY29lt/e4v\nsEpfIZq+RrDTZERfdrBVWDdn8ES13r6Nu7Z4G6wkcUzfOh/TOAqFTk6tVyIRbMEL\n6CdT3lwZNANYqUYbbmdZ6rlYomBLmN07oq6s1XaIebV0RtYKVYnjvopY+EKoD6sD\n6hP16ZyvvJ7HPUc81oBQR5DH4wKBgQDHo8Y4K0eUM4PaEdO3wn7OC2H3+KH4ZLou\n/9wWnKkL+GzNmju6jTSFjGD9T7kNwV0dwaZRYX3YO8bqrsLaACs39dM3F2BFpMW3\nPFISOYpfi/TJh06Pi4++yvu0RhC+i//3wyRZH2HgsRGZNj4Oygwz/tssG+pw0/e0\nuAywhrpnDwJ/HO5j82ZRjnukZPdUqwC+3+OWqa65zVmDuyoIQU12DlfayEzNAgXs\nNgd21WA21W7iyyqmOw4rZNotrCLFgM9Uac8ebDp8N0pEBWCkWUzTUPI/18p1l3YD\nvPCczYNclhTSWI0DwzuLJEXUlH2AOQTdoctlA/IJJGz/CRVz9TWMBQKBgQCT9fGn\nF4yJblS+fo/nlaLdmtoVKpUAv8atpru7lohDcu9QwoqaDKVshUos87U3WKRmtWtK\nzXKznDolHTkU0SM26l6MairT8vcGgxJgp3zCq7vU0Q+Mm+cBhPdf+L3YO3KOcnay\nBuxH13QvlWARHfZFYxGVc2siDDd+HRpqirAESQKBgGCd2/tbHqmwMMFIB0wm7oKi\n6NKuTrRr/sMOK+KN0er0qs/1O2dLJmNP3yYCHJjD3XCW1tzpXD6ADkI/NMb7lIv+\n2o1A+CKhG8omJ3r4pDUUJgSnkySmKqILhB98ioWW98m9deUEk4KXFyDTUdFjIvU9\nfyKEKeEW4pI+W/V+7pia\n-----END PRIVATE KEY-----\n",
          clientEmail: "firebase-adminsdk-saxbp@boss-auth123456789.iam.gserviceaccount.com",
          clientId: "110622052791792872676",
          authUri: "https://accounts.google.com/o/oauth2/auth",
          tokenUri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          authProviderX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-saxbp%40boss-auth123456789.iam.gserviceaccount.com",
          clientC509CertUrl: "googleapis.com"
        }
        // const firebaseConfig = {
        //   type: this.configService.get<string>('TYPE'),
        //   projectId: this.configService.get<string>('PROJECT_ID'),
        //   privateKeyId: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
        //   privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
        //   clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        //   clientId: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        //   authUri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        //   tokenUri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        //   authProviderX509CertUrl: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
        //   clientC509CertUrl: this.configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL'),
        // };


        
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





