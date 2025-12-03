import { ErrorCodes } from '@app/common/code/error/error.code';
import { appConfig } from '@app/common/configs';
import { Auth } from '@app/common/decorator/auth.decorator';
import { SignAuthGuard } from '@app/common/guards/sign.auth.guard';
import { AuthIdSchema } from '@app/common/packets/auth/AuthId';
import { InitPasswordSchema } from '@app/common/packets/auth/InitPassword';
import { ResetPasswordSchema } from '@app/common/packets/auth/ResetPassword';
import { ReVerifySchema } from '@app/common/packets/auth/ReVerify';
import { SignInSchema } from '@app/common/packets/auth/SignIn';
import { SignUpSchema } from '@app/common/packets/auth/SignUp';
import { VerifySchema } from '@app/common/packets/auth/Verify';
import { VerifyCodeSchema } from '@app/common/packets/auth/VerifyCode';
import { AuthPipe } from '@app/common/pipes/auth.pipe';
import { TokenPipe } from '@app/common/pipes/token.pipe';
import { AuthMessage } from '@app/common/providers/messages/auth.message';
import { BadRequestException, Body, Controller, ForbiddenException, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClsService } from 'nestjs-cls';
import { lastValueFrom, timeout } from 'rxjs';
import { Users } from '@app/common/domains/Users';
import type { ConfigType } from '@nestjs/config';
import { UsersUidSchema } from '@app/common/packets/auth/UsersUid';

@Controller('auth')
export class AuthGateway {
  constructor(
    @Inject('AUTH_SERVICE') private userCp: ClientProxy,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    private cls: ClsService,
  ) {}
  /* Admin ************************************************/

  /********************************************************/

  /* Biz **************************************************/

  /********************************************************/

  /* User *************************************************/
  @Post('/signOut')
  async signOut(@Auth(TokenPipe) pToken: string) {
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_SIGN_OUT, { requestId: this.cls.get('requestId'), pToken })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/reSign')
  async reSign(@Auth(TokenPipe) pToken: string) {
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_RE_SIGN, { requestId: this.cls.get('requestId'), pToken })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }
  /********************************************************/

  /* Public ***********************************************/
  @Post('/signUp')
  async signUp(@Body('users') pUsers: Users) {
    const res = SignUpSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_SIGN_UP, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/verify')
  async verify(@Body('users') pUsers: Users) {
    const res = VerifySchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_VERIFY, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/reVerify')
  async reVerify(@Body('users') pUsers: Users) {
    const res = ReVerifySchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_RE_VERIFY, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/signIn')
  async signIn(@Body('users') pUsers: Users) {
    const res = SignInSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_SIGN_IN, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/find/password')
  async findPassword(@Body('users') pUsers: Users) {
    const res = AuthIdSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_FIND_PASSWORD, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/verify/code')
  async verifyCode(@Body('users') pUsers: Users) {
    const res = VerifyCodeSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_VERIFY_CODE, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/reset/password')
  @UseGuards(SignAuthGuard)
  async resetPassword(@Auth(AuthPipe) requestMember: Users, @Body('users') pUsers: Users) {
    const res = ResetPasswordSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    pUsers.identifier = requestMember.identifier;
    pUsers.updatedBy = requestMember.firstName
      ? requestMember.lastName
        ? `${requestMember.firstName} ${requestMember.lastName}`
        : requestMember.firstName
      : 'no name';
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_RESET_PASSWORD, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  // @Post('/verify/password')
  // @UseGuards(SignBizGuard)
  // async verifyPassword(@Auth(AuthPipe) requestMember: Users, @Body('users') pUsers: Users) {
  //   const res = ResetPasswordSchema.validate(pUsers);
  //   if (!pUsers || res.error) {
  //     throw new BadRequestException({
  //       code: ErrorCodes.BR001,
  //     });
  //   }
  //   pUsers.identifier = requestMember.identifier;
  //   return await lastValueFrom(
  //     this.userCp
  //       .send(AuthMessage.AUTH_VERIFY_PASSWORD, { requestId: this.cls.get('requestId'), users: pUsers })
  //       .pipe(timeout(this.appConf.AppsTimeout)),
  //   );
  // }

  @Post('/refresh/password')
  @UseGuards(SignAuthGuard)
  async refreshPassword(@Auth(AuthPipe) pUsers: Users) {
    if (pUsers.grade === Users.GRADE.MEMBER) {
      pUsers.updatedBy = pUsers.firstName
        ? pUsers.lastName
          ? `${pUsers.firstName} ${pUsers.lastName}`
          : pUsers.firstName
        : 'no name';
      return await lastValueFrom(
        this.userCp
          .send(AuthMessage.AUTH_REFRESH_PASSWORD_EXPIRED, { requestId: this.cls.get('requestId'), users: pUsers })
          .pipe(timeout(this.appConf.AppsTimeout)),
      );
    } else {
      throw new ForbiddenException({
        code: ErrorCodes.FB005,
      });
    }
  }

  @Post('/check/init/password')
  async checkInitPassword(@Body('users') pUsers: Users) {
    const res = UsersUidSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_CHECK_INIT_PASSWORD, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }

  @Post('/init/password')
  async initPassword(@Body('users') pUsers: Users) {
    const res = InitPasswordSchema.validate(pUsers);
    if (!pUsers || res.error) {
      throw new BadRequestException({
        code: ErrorCodes.BR001,
      });
    }
    return await lastValueFrom(
      this.userCp
        .send(AuthMessage.AUTH_INIT_PASSWORD, { requestId: this.cls.get('requestId'), users: pUsers })
        .pipe(timeout(this.appConf.AppsTimeout)),
    );
  }
  /********************************************************/
}
