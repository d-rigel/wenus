import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import { paginate } from '../paginate';
import { IArticleModel, IArticleDoc } from './article.interface';

const articleSchema = new mongoose.Schema<IArticleDoc, IArticleModel>(
  {
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
    image: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [String],

    articleId: {
      type: String,
    },
    createdTime: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

// /**
//  * Generate articleId
//  * @returns {Promise<string>}
//  */
articleSchema.static('generateArticleId', async function (): Promise<string> {
  const article = await this.findOne().sort({ createdAt: -1 }).allowDiskUse(true);
  const articleId = article ? article.articleId : 'AT00000000';
  const articleIdNumber = parseInt(articleId.substring(2), 10);
  const newArticleIdNumber = articleIdNumber + 1;
  const newArtilceId = `AT${newArticleIdNumber.toString().padStart(8, '0')}`;
  return newArtilceId;
});

const Article = mongoose.model<IArticleDoc, IArticleModel>('Article', articleSchema);

export default Article;
