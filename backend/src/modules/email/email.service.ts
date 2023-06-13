import nodemailer from 'nodemailer';
import { Message } from './email.interfaces';
// import Mailgun from 'mailgun.js';
// import FormData from 'form-data';
// import { MailgunMessageData, MessagesSendResult } from 'mailgun.js/interfaces/Messages';
import request from 'request';
import config from '../../config/config';
import logger from '../logger/logger';
// import { IElection } from '../election/election.interface';
// import { IDeployment } from '../deployment/deployment.interface';

// export const transport = nodemailer.createTransport(config.email.smtp);
// /* istanbul ignore next */
// if (config.env !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

export const createTransport = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.smtp.auth.user,
      pass: config.email.smtp.auth.pass,
    },
  });

export const transport = createTransport();
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @param {{ path: string; filename: string }[]} attachments
 * @returns {Promise<void>}
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
  attachments?: { path: string; filename: string }[]
): Promise<void> => {
  const msg: Message | any = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  if (attachments) {
    const attach = attachments.map((attachment) => {
      return {
        filename: attachment.filename,
        data: request(attachment.path),
      };
    });
    msg.attachment = attach;
  }
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: <a target="_blank" href="${resetPasswordUrl}">reset password link</a> </p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send admin invite email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendAdminInviteEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const text = `Hi,
  You have been added as an admin of the application, you will need to set your password, click on this link: ${resetPasswordUrl} to set your password
  `;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p> You have been added as an admin of the application, you will need to reset your password, click on this link: <a target="_blank" href="${resetPasswordUrl}">to set your password</a> </p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string, code: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name}!

  Your verification code is ${code}.
  
  Enter this code to complete your account registeration. You can also click this link ${verificationEmailUrl}
    
  If you have any questions, send us an email alozie4God@gmail.com.
  
  We’re glad you’re here!
  The WENUS team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Your verification code is <b>${code}</b></p>
  <p>Enter this code to complete your account registeration.</p>
  <p>You can also verify email at: <a target="_blank" href="${verificationEmailUrl}">verify email</a></p>
  <p> If you have any questions, send us an email rigel4g@gmail.com</p>
  <p>We’re glad you’re here!</p>
  </div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: <a target="_blank" href="${verificationEmailUrl}">verify email link</a></p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to: string, name: string): Promise<void> => {
  const subject = 'Account Created Successfully';
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `${config.clientUrl}/auth/login`;
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: <a target="_blank" href="${loginUrl}">login link</a></p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send alert after login
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendLoginEmail = async (to: string, name: string, extras: Record<string, string>): Promise<void> => {
  const subject = 'New Login Attempt';
  // replace this url with the link to the password reset page
  const resetPasswordUrl = `${config.clientUrl}/auth/password-reset`;
  const text = `Hi ${name},
  There has been a new login attempt on your account. 
  IP Address: ${extras['ipAddress']}
  Device Agent: ${extras['device']}
  If you did not initiate this login attempt, please proceed to reset your password here : ${resetPasswordUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>There has been a new login attempt on your account.</p>
  <p><strong>IP Address:</strong> ${extras['ipAddress']}</p>
  <p><strong>Device Agent:</strong> ${extras['device']}</p>
  <p>If you did not initiate this login attempt, please proceed to reset your password here: <a target="_blank" href="${resetPasswordUrl}">reset password link</a></p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send invite email
 * @param {string} to
 * @param {string} invitationCode
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendInvitemail = async (to: string, invitationCode: string, name: string, stack: string): Promise<void> => {
  const subject = 'Invitation to WENUS Social app';
  // replace this url with the link to the sign up page of your front-end app
  const signUpUrl = `${config.clientUrl}/auth/signup?invitationCode=${invitationCode}`;
  const text = `Hi ${name},
  You have been invited to WENUS app as a ${stack} engineer. Please click on this link to complete your registration: ${signUpUrl}`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p> You have been invited to WENUS app as a  ${stack} engineer.</p><p>Please click on this link to complete your registration: <a target="_blank" href="${signUpUrl}">registration link</a></p></div>`;
  await sendEmail(to, subject, text, html);
};

// ...................................................................................

// export const createTransport = (): {
//   sendMail: (m: MailgunMessageData) => Promise<MessagesSendResult>;
//   verify: () => Promise<void | Error>;
// } => {
//   try {
//     const mailgun = new Mailgun(FormData);
//     const mg = mailgun.client({
//       username: config.email.mailgun.username,
//       key: config.email.mailgun.apiKey,
//     });
//     return {
//       sendMail: async (message: MailgunMessageData) => mg.messages.create(config.email.mailgun.domain, message),
//       verify: () => Promise.resolve(),
//     };
//   } catch (error) {
//     return {
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       sendMail: (_: MailgunMessageData) => Promise.reject(error),
//       verify: () => Promise.reject(error),
//     };
//   }
// };

// export const transport = createTransport();
// /* istanbul ignore next */
// if (config.env !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

// /**
//  * Send an email
//  * @param {string} to
//  * @param {string} subject
//  * @param {string} text
//  * @param {string} html
//  * @param {{ path: string; filename: string }[]} attachments
//  * @returns {Promise<void>}
//  */
// export const sendEmail = async (
//   to: string,
//   subject: string,
//   text: string,
//   html: string,
//   attachments?: { path: string; filename: string }[]
// ): Promise<void> => {
//   const msg: MailgunMessageData = {
//     from: config.email.from,
//     to,
//     subject,
//     text,
//     html,
//   };
//   if (attachments) {
//     const attach = attachments.map((attachment) => {
//       return {
//         filename: attachment.filename,
//         data: request(attachment.path),
//       };
//     });
//     msg.attachment = attach;
//   }
//   await transport.sendMail(msg);
// };

// /**
//  * Send reset password email
//  * @param {string} to
//  * @param {string} token
//  * @returns {Promise<void>}
//  */
// export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
//   const subject = 'Reset password';
//   // replace this url with the link to the reset password page of your front-end app
//   const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
//   const text = `Hi,
//   To reset your password, click on this link: ${resetPasswordUrl}
//   If you did not request any password resets, then ignore this email.`;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
//   <p>To reset your password, click on this link: <a target="_blank" href="${resetPasswordUrl}">reset password link</a> </p>
//   <p>If you did not request any password resets, please ignore this email.</p>
//   <p>Thanks,</p>
//   <p><strong>Team</strong></p></div>`;
//   await sendEmail(to, subject, text, html);
// };

// /**
//  * Send admin invite email
//  * @param {string} to
//  * @param {string} token
//  * @returns {Promise<void>}
//  */
// export const sendAdminInviteEmail = async (to: string, token: string): Promise<void> => {
//   const subject = 'Reset password';
//   // replace this url with the link to the reset password page of your front-end app
//   const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
//   const text = `Hi,
//   You have been added as an admin of the application, you will need to set your password, click on this link: ${resetPasswordUrl} to set your password
//   `;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
//   <p> You have been added as an admin of the application, you will need to reset your password, click on this link: <a target="_blank" href="${resetPasswordUrl}">to set your password</a> </p>
//   <p>Thanks,</p>
//   <p><strong>Team</strong></p></div>`;
//   await sendEmail(to, subject, text, html);
// };

// /**
//  * Send verification email
//  * @param {string} to
//  * @param {string} token
//  * @param {string} name
//  * @returns {Promise<void>}
//  */
// export const sendVerificationEmail = async (to: string, token: string, code: string, name: string): Promise<void> => {
//   const subject = 'Email Verification';
//   // replace this url with the link to the email verification page of your front-end app
//   const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
//   const text = `Hi ${name}!

//   Your verification code is ${code}.

//   Enter this code to complete your account registeration. You can also click this link ${verificationEmailUrl}

//   If you have any questions, send us an email inec-support@mail.com.

//   We’re glad you’re here!
//   The INEC team`;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
//   <p>Your verification code is <b>${code}</b></p>
//   <p>Enter this code to complete your account registeration.</p>
//   <p>You can also verify email at: <a target="_blank" href="${verificationEmailUrl}">verify email</a></p>
//   <p> If you have any questions, send us an email inec-support@mail.com</p>
//   <p>We’re glad you’re here!</p>
//   </div>`;
//   await sendEmail(to, subject, text, html);
// };

// /**
//  * Send email verification after registration
//  * @param {string} to
//  * @param {string} token
//  * @param {string} name
//  * @returns {Promise<void>}
//  */
// export const sendSuccessfulRegistration = async (to: string, token: string, name: string): Promise<void> => {
//   const subject = 'Email Verification';
//   // replace this url with the link to the email verification page of your front-end app
//   const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
//   const text = `Hi ${name},
//   Congratulations! Your account has been created.
//   You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
//   Don't hesitate to contact us if you face any problems
//   Regards,
//   Team`;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
//   <p>Congratulations! Your account has been created.</p>
//   <p>You are almost there. Complete the final step by verifying your email at: <a target="_blank" href="${verificationEmailUrl}">verify email link</a></p>
//   <p>Don't hesitate to contact us if you face any problems</p>
//   <p>Regards,</p>
//   <p><strong>Team</strong></p></div>`;
//   await sendEmail(to, subject, text, html);
// };

// /**
//  * Send email verification after registration
//  * @param {string} to
//  * @param {string} name
//  * @returns {Promise<void>}
//  */
// export const sendAccountCreated = async (to: string, name: string): Promise<void> => {
//   const subject = 'Account Created Successfully';
//   // replace this url with the link to the email verification page of your front-end app
//   const loginUrl = `${config.clientUrl}/auth/login`;
//   const text = `Hi ${name},
//   Congratulations! Your account has been created successfully.
//   You can now login at: ${loginUrl}
//   Don't hesitate to contact us if you face any problems
//   Regards,
//   Team`;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
//   <p>Congratulations! Your account has been created successfully.</p>
//   <p>You can now login at: <a target="_blank" href="${loginUrl}">login link</a></p>
//   <p>Don't hesitate to contact us if you face any problems</p>
//   <p>Regards,</p>
//   <p><strong>Team</strong></p></div>`;
//   await sendEmail(to, subject, text, html);
// };

// /**
//  * Send alert after login
//  * @param {string} to
//  * @param {string} name
//  * @returns {Promise<void>}
//  */
// export const sendLoginEmail = async (to: string, name: string, extras: Record<string, string>): Promise<void> => {
//   const subject = 'New Login Attempt';
//   // replace this url with the link to the password reset page
//   const resetPasswordUrl = `${config.clientUrl}/auth/password-reset`;
//   const text = `Hi ${name},
//   There has been a new login attempt on your account.
//   IP Address: ${extras['ipAddress']}
//   Device Agent: ${extras['device']}
//   If you did not initiate this login attempt, please proceed to reset your password here : ${resetPasswordUrl}
//   Don't hesitate to contact us if you face any problems
//   Regards,
//   Team`;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
//   <p>There has been a new login attempt on your account.</p>
//   <p><strong>IP Address:</strong> ${extras['ipAddress']}</p>
//   <p><strong>Device Agent:</strong> ${extras['device']}</p>
//   <p>If you did not initiate this login attempt, please proceed to reset your password here: <a target="_blank" href="${resetPasswordUrl}">reset password link</a></p>
//   <p>Don't hesitate to contact us if you face any problems</p>
//   <p>Regards,</p>
//   <p><strong>Team</strong></p></div>`;
//   await sendEmail(to, subject, text, html);
// };

// /**
//  * Send invite email
//  * @param {string} to
//  * @param {string} invitationCode
//  * @param {string} name
//  * @returns {Promise<void>}
//  */
// export const sendInvitemail = async (to: string, invitationCode: string, name: string, position: string): Promise<void> => {
//   const subject = 'Invitation to CROMS Collation';
//   // replace this url with the link to the sign up page of your front-end app
//   const signUpUrl = `${config.clientUrl}/auth/signup?invitationCode=${invitationCode}`;
//   const text = `Hi ${name},
//   You have been invited to CROM Collation as a user applying for the ${position} position. Please click on this link to complete your onboarding: ${signUpUrl}`;
//   const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
//   <p> You have been invited to CROM Collation as a user applying for the ${position} position.</p><p>Please click on this link to complete your onboarding: <a target="_blank" href="${signUpUrl}">onboarding link</a></p></div>`;
//   await sendEmail(to, subject, text, html);
// };
