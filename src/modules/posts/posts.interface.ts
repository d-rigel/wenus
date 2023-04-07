import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
// import { IUserDoc } from '../user/user.interfaces';

export interface IArticle {
  title: string;
  article: string;
  //   creator: IUserDoc;
  creator: string;
  images: string;
  comments: string;
  likes: number;
  createdAt: Date;
  articleId: string;
}

export interface IArticleDoc extends IArticle, Document {}

export type NewArticle = Omit<IArticle, 'slug'>;

export type UpdateArticleBody = Partial<IArticle>;

export interface IArticleModel extends Model<IArticleDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  isArticleExist(slug: string, articleId?: mongoose.Types.ObjectId): Promise<boolean>;
  generateArticleId(): Promise<string>;
}
