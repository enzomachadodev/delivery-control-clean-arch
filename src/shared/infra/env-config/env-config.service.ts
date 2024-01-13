import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private configService: ConfigService) {}
  getAppPort(): number {
    return Number(this.configService.get('PORT'));
  }

  getNodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  getJwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }

  getJwtExpiresInSeconds(): number {
    return Number(this.configService.get('JWT_EXPIRES_IN'));
  }
}
