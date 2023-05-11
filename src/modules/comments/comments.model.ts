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

const Comment = mongoose.model<ICommentDoc, ICommentModel>('Comment', commentSchema);

export default Comment;
