import { CustomHelpers } from 'joi';
import mongoose from 'mongoose';

export const objectId = (value: string, helpers: CustomHelpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};
