import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import {Strategy} from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID:
        '394028082092-32c8qcjiiahp55ob8ota9a2oj6nkf7si.apps.googleusercontent.com', // <- Replace this with your client id
      clientSecret: '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', // <- Replace this with your client secret
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done,
  ) {
    try {
      const authParams = {
        displayName: profile.displayName,
        userId: profile.id,
        email: profile.emails[0].value,
      };
      const { accessToken } = await this.authService.signInGoogle(authParams);
      const response = {
        accessToken,
        email: profile.emails[0].value,
        displaName: authParams.displayName,
      };
      done(null, response);
    } catch (err) {
      // console.log(err)
      done(err, false);
    }
  }
}
