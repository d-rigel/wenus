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
    // creator: {
    //   type: String,
    // },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    // likes: {
    //   type: Number,
    //   default: 0,
    // },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    // comments: {
    //   type: [String],
    //   default: [],
    // },
    // comments: [
    //   {
    //     type: String,
    //   },
    // ],

    comments: [
      {
        comment: {
          type: mongoose.Types.ObjectId,
          ref: 'Comment',
        },
        creator: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
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

// Check if article already exists
articleSchema.static('isArticleExist', async function (title: string): Promise<boolean> {
  const articled = await this.findOne({ title });
  return !!articled;
});

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
