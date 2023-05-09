import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { IUserDoc } from '../user/user.interfaces';
import { IArticleDoc } from '../articles/article.interface';

export interface IComment {
  content: string | IArticleDoc;
  articleIds?: IArticleDoc | mongoose.Types.ObjectId | undefined;
  // articleId: string;
  articleUserId: IUserDoc | mongoose.Types.ObjectId | undefined;
  // likes: IUserDoc | mongoose.Types.ObjectId | undefined | number;
  creator?: IUserDoc | mongoose.Types.ObjectId | undefined | string;
  // title?: string;
  // article?: string;
  // image?: string;
}

export interface ICommentDoc extends IComment, Document {}

// export type NewComment = Omit<IComment, 'slug'>;
export type NewComment = IComment;

export type UpdateCommentBody = Partial<IComment>;

export interface ICommentModel extends Model<ICommentDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  // isArticleExist(slug: string, articleId?: mongoose.Types.ObjectId): Promise<boolean>;
  // generateArticleId(): Promise<string>;
}
