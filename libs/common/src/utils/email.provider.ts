import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import * as nodemailer from 'nodemailer';
import { appConfig, emailConfig } from '../configs';
import { Members } from '../domains/Users';
import { Logger } from './logger';
import * as fs from 'fs';
import { PaymentsOrders } from '../domains/PaymentsOrders';

@Injectable()
export class EmailProvider {
  private transporter;
  private templates = [];
  private headerTemplate;
  private footerTemplate;
  constructor(
    @Inject(emailConfig.KEY)
    private config: ConfigType<typeof emailConfig>,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    private logger: Logger,
    private cls: ClsService,
  ) {
    this.getTransporter();
    this.getTemplates();
  }

  private getTemplates() {
    try {
      const folderPath = './libs/common/src/templates/';
      fs.readdirSync(folderPath).forEach((fileName) => {
        if (fileName === 'header.html') {
          this.headerTemplate = fs.readFileSync(folderPath.concat(fileName), 'utf8');
        } else if (fileName === 'footer.html') {
          this.footerTemplate = fs.readFileSync(folderPath.concat(fileName), 'utf8');
        } else {
          this.templates.push({ file: fileName, html: fs.readFileSync(folderPath.concat(fileName), 'utf8') });
        }
      });
    } catch (err) {
      this.logger.msg(`${err.name} [ - ]`, [err.message], 'Email Template Initialize Error');
    }
  }

  private getTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: 465,
      secure: true,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }

  /* To All Grade */
  // 비밀번호 찾기 인증 번호 메일 발송
  public async sendVerifyNumberForFindPassword(receivers: string[], digits: number) {
    this.send(
      receivers,
      `[TEST] 비밀번호 찾기 인증번호 안내`,
      `아래 인증 번호 확인 후 인증을 완료해 주세요.\n인증 번호는 10분 간 유효합니다.\n인증 번호 : ${digits}`,
    );
  }

  /* To Super Biz */
  // biz 회원 가입 시, super biz에게 승인 요청 메일 발송
  public async sendApprovalEmailToSuperBizForSignUp(receivers: string[], requester: Members) {
    this.send(
      receivers,
      `[TEST] 자산 판매 운영자(${requester.identifier.split('@')[0]}) 회원 가입 알림`,
      `자산 판매 운영자 ${requester.identifier}님의 회원 가입이 요청되었습니다.\n로그인하여 승인 처리를 해주세요.\n${this.appConf.bizPublicUrl}`,
    );
  }
  // 가입 초대 메일 발송
  public async sendSignUpInvitation(receivers: string[], data: Members, link: any) {
    let template = this.templates.find((template) => template.file === 'invitation.html').html;
    template = template
      .replace('{{sender}}', data.companyName ? data.companyName : data.createdBy)
      .replaceAll('{{receiver}}', `${data.firstName} ${data.lastName}`)
      .replace('{{link}}', link)
      .replace('{{email}}', receivers[0]);

    this.send(receivers, `[test] Administrator invitation`, template);
  }

  /* To Biz */
  // biz 회원 가입 승인 완료 처리 안내 메일 발송
  public async sendApprovalEmailToBizForSignUp(receivers: string[]) {
    this.send(
      receivers,
      '[TEST] 회원 가입 승인 완료',
      `자산 판매 관리자로부터 회원 가입이 승인되었습니다.\n서비스 이용이 가능합니다.\n${this.appConf.bizPublicUrl}`,
    );
  }

  /* To User */
  // user 회원 가입 시, 인증 링크 발송
  public async sendVerifyLinkToUser(receivers: string[], verifyLink: string) {
    this.send(receivers, `[TEST] 아이디 이메일 인증`, `인증을 위해 아래 링크를 클릭해 주세요.\n${verifyLink}`);
  }

  // 청약 신청 입금 안내 메일 발송
  public async sendSubscriptionApplicationInfo(receivers: string[], data: PaymentsOrders) {
    let template = this.templates.find((template) => template.file === 'subscriptionApplicationInfo.html').html;

    template = template
      .replace('{{orderId}}', data.id)
      .replace('{{price}}', data.price)
      .replace('{{deadline}}', data['deadline'])
      .replaceAll('{{accountNumber}}', 'data.accountNumber');

    this.send(receivers, `[test] Please complete your application.`, template);
  }

  private async send(receivers: string[], title: string, template: string, retry?: number) {
    const requestId = this.cls.get('requestId');
    receivers.forEach((receiver) => {
      this.transporter.sendMail(
        {
          from: '"TestName" <noreply@test.io>',
          to: receiver,
          subject: title,
          // text: content,
          html: this.headerTemplate + template + this.footerTemplate,
        },
        (err, info) => {
          if (err) {
            this.logger.msg(
              `${err.name} [ ${requestId} ]`,
              [err.message, `receiver : ${receiver}`],
              'EmailProvider Error',
            );
            // reTry
            if (!retry || retry < 3) {
              this.getTransporter();
              this.send([receiver], title, template, ++retry || 1);
            }
          }
          // if (info) {
          //   this.logger.msg(
          //     `Success [ ${requestId} ]`,
          //     [info.response, `receiver : ${receiver}`],
          //     'EmailProvider Success',
          //   );
          // }
        },
      );
    });
  }
}
