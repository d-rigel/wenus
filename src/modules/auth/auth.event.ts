/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// import mongoose from 'mongoose';
import { subscribeToEvent } from '../utils/emit-event';
import { IUserDoc } from '../user/user.interfaces';
import { emailService } from '../email';
import { tokenService } from '../token';
import { ILogin } from './auth.interfaces';
// import { userService } from '../user';

const eventLog: Record<string, Function> = {
  user_registered: async (user: IUserDoc) => {
    if (!user.invitationCode) {
      const { verifyEmailToken, confirmationCode } = await tokenService.saveConfirmationToken(user.id);
      return emailService.sendVerificationEmail(
        user.email,
        `${verifyEmailToken}`,
        confirmationCode,
        `${user.firstName || ''} ${user.lastName || ''}`
      );
    }
  },
  user_login: async (user: ILogin) => {
    return emailService.sendLoginEmail(user.email, `${user.firstName || ''} ${user.lastName || ''}`, {
      ipAddress: user.ipAddress,
      device: user.device,
    });
  },
};

// eslint-disable-next-line guard-for-in
for (const event in eventLog) {
  subscribeToEvent<Record<string, any>>(event, async (data: Record<string, any>) => {
    const fn = eventLog[event] as Function;
    fn(data);
  });
}
