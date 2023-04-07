import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import { paginate } from '../paginate';
import { IArticleModel, IArticleDoc } from './posts.interface';

const articleSchema = new mongoose.Schema<IArticleDoc, IArticleModel>({
  title: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
  },
  //   creator: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
  images: {
    type: String,
  },
  likes: {
    type: Number,
  },
  articleId: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

// /**
//  * Generate articleId
//  * @returns {Promise<string>}
//  */
articleSchema.static('generateArticleId', async function (): Promise<string> {
  const article = await this.findOne().sort({ createdAt: -1 }).allowDiskUse(true);
  const articleId = article ? article.articleId : 'EL00000000';
  const articleIdNumber = parseInt(articleId.substring(2), 10);
  const newArticleIdNumber = articleIdNumber + 1;
  const newArtilceId = `EL${newArticleIdNumber.toString().padStart(8, '0')}`;
  return newArtilceId;
});

const Article = mongoose.model<IArticleDoc, IArticleModel>('Article', articleSchema);

export default Article;
