import { v4 as uuidv4 } from 'uuid';

/**
 * Generate an invite code
 * @param {}
 * @param {string}
 * @returns {string}
 */
const generateInviteCode = () => uuidv4().replace(/-/g, '').substring(0, 8);

export default generateInviteCode;
