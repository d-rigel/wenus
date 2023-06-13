import { Response } from 'express';

const sendResponse = (res: Response, httpStatus: number, responseBody: Record<string, any>, message: string) => {
  return res.status(httpStatus).send({
    data: responseBody,
    message,
  });
};

export default sendResponse;
