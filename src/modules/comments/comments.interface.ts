import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { IUserDoc } from '../user/user.interfaces';
import { IArticleDoc } from '../articles/article.interface';

export interface IComment {
  content: string | IArticleDoc;
  articleIds?: IArticleDoc | mongoose.Types.ObjectId | undefined;
  articleUserId?: IUserDoc | mongoose.Types.ObjectId | undefined;
  creator: IUserDoc | mongoose.Types.ObjectId | undefined | string;
}

export interface ICommentDoc extends IComment, Document {}

export type NewComment = IComment;

export type UpdateCommentBody = Partial<IComment>;

export interface ICommentModel extends Model<ICommentDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
