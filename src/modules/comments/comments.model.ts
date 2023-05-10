import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import { paginate } from '../paginate';
// import { IArticleModel, IArticleDoc } from './comments.interface';
import { ICommentModel, ICommentDoc } from './comments.interface';

const commentSchema = new mongoose.Schema<ICommentDoc, ICommentModel>(
  {
    content: {
      type: String,
      required: true,
    },
    creator: { type: mongoose.Types.ObjectId, ref: 'User' },
    articleIds: { type: mongoose.Types.ObjectId, ref: 'Article' },
    articleUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

// Check if article already exists
// articleSchema.static('isArticleExist', async function (title: string): Promise<boolean> {
//   const articled = await this.findOne({ title });
//   return !!articled;
// });

// /**
//  * Generate articleId
//  * @returns {Promise<string>}
//  */
// articleSchema.static('generateArticleId', async function (): Promise<string> {
//   const article = await this.findOne().sort({ createdAt: -1 }).allowDiskUse(true);
//   const articleId = article ? article.articleId : 'AT00000000';
//   const articleIdNumber = parseInt(articleId.substring(2), 10);
//   const newArticleIdNumber = articleIdNumber + 1;
//   const newArtilceId = `AT${newArticleIdNumber.toString().padStart(8, '0')}`;
//   return newArtilceId;
// });

const Comment = mongoose.model<ICommentDoc, ICommentModel>('Comment', commentSchema);

export default Comment;
