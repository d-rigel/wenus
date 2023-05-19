/* eslint-disable no-continue */
/* eslint-disable import/no-cycle */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { subscribeToEvent } from '../utils/emit-event';
import { emailService } from '../email';
import { IInvite, IInviteExcelRow, IInviteStatus } from './user.invite.interfaces';
import generateInviteCode from '../utils/generate.invite.code';
import Invite from './user.invite.model';
import Batch from './user.batch.model';
import { applicationService } from '../application';
// import { userService } from '.';
// import { officerService } from '../officer';

const eventLog: Record<string, Function> = {

  admin_created: async (data: { email: string; token: string }) => {
    await emailService.sendAdminInviteEmail(data.email, data.token);
  },
};

for (const event in eventLog) {
  subscribeToEvent<Record<string, any>>(event, async (data: Record<string, any>) => {
    const fn = eventLog[event] as Function;
    fn(data);
  });
}
