import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { IUserDoc } from '../user/user.interfaces';
import { ICommentDoc } from '../comments/comments.interface';
export interface IArticle {
  title: string;
  article: string;
  creator: IUserDoc | mongoose.Types.ObjectId | undefined;
  // creator: string;
  image?: string;
  // comments: string[];
  comments?: {
    creator: IUserDoc | mongoose.Types.ObjectId | undefined;
    comment: ICommentDoc | mongoose.Types.ObjectId | undefined;
  }[];

  likes: number;
  // createdAt: Date;
  createdTime?: Date;
  articleId: string;
}

export interface IArticleDoc extends IArticle, Document {}

// export type NewArticle = Omit<IArticle, 'slug'>;
export type NewArticle = IArticle;

export type UpdateArticleBody = Partial<IArticle>;

export interface IArticleModel extends Model<IArticleDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  isArticleExist(slug: string, articleId?: mongoose.Types.ObjectId): Promise<boolean>;
  generateArticleId(): Promise<string>;
}
