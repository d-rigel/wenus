import { EventEmitter } from 'events';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

const EventBus = new EventEmitter();

export const emitEvent = (event: string, messageData: Record<string, any>) => {
  EventBus.emit(event, messageData);
};

export const subscribeToEvent = <DataT>(event: string, listenerFn: (data: DataT) => Promise<void>) => {
  EventBus.on(event, (messageData: DataT) => {
    try {
      listenerFn(messageData);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${error}`);
    }
  });
};
