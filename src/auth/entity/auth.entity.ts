//src/auth/entity/auth.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class AuthEntity {
  status: boolean;
  user: UserEntity;
  @ApiProperty()
  accessToken: string;
  refreshToken : string;
}
