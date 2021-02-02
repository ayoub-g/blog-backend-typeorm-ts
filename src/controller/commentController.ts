import * as express from 'express';
import * as  HttpStatus from 'http-status-codes';
import *  as url from 'url';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/Comment';

export class CommentController {
    commentRepository: Repository<Comment>;
    router: any;
    constructor(commentRespository) {
        this.router = express.Router();
        this.commentRepository = commentRespository;
        this.router.delete("/", this.deleteComment);
        this.router.patch("/", this.updateComment);
        this.router.post('/', this.addComment);
        this.router.get('/', this.getPostComments);
    }
    getPostComments = async (req, res) => {
        const { postId } = url.parse(req.url, true).query;
        try {
            if (postId) {
                const comments = await this.commentRepository
                    .createQueryBuilder('comment')
                    .where('comment.post = :postId', { postId })
                    .select([
                        'comment.id as id',
                        'comment.content as content',
                        'comment.date as date',
                        'comment.responseToCommentId',
                        'comment.userId as userId',
                        'comment.postId as postId',
                    ])
                    .orderBy('date', 'DESC')
                    .getRawMany();
                res.status(HttpStatus.StatusCodes.OK).json(comments);
            } else {
                res
                    .status(HttpStatus.StatusCodes.BAD_REQUEST)
                    .json({ message: 'missing query parameters' });
            }
        } catch (error) {
            // console.log(error);
            res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'error' });
        }
    };

    addComment = async (req, res) => {
        const comment = req.body;
        try {
            if (
                comment &&
                comment.content &&
                comment.date &&
                comment.user &&
                comment.post
            ) {
                await this.commentRepository.save(comment);
                res.status(HttpStatus.StatusCodes.CREATED).json({ message: 'OK' });
            } else {
                res
                    .status(HttpStatus.StatusCodes.BAD_REQUEST)
                    .json({ message: 'missing query parameters' });
            }
        } catch (error) {
            // console.log(error);
            res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'error' });
        }
    };

    updateComment = async (req, res) => {
        const comment = req.body;
        try {
            if (comment && comment.content && comment.id && comment.date) {
                await this.commentRepository
                    .createQueryBuilder()
                    .update(Comment)
                    .set(comment)
                    .where("id = :id", { id: comment.id })
                    .execute();
                res.status(HttpStatus.StatusCodes.CREATED).json({ message: "OK" });
            } else {
                res
                    .status(HttpStatus.StatusCodes.BAD_REQUEST)
                    .json({ message: "missing query parameters" });
            }
        } catch (error) {
            // console.log(error);
            res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "error" });
        }
    };
    deleteComment = async (req, res) => {
        try {
            const { id } = url.parse(req.url, true).query;
            if (id) {
                await this.commentRepository
                    .createQueryBuilder()
                    .delete()
                    .from(Comment)
                    .where("id = :id", { id })
                    .execute();
                res.status(HttpStatus.StatusCodes.CREATED).json({ message: "OK" });
            } else {
                res
                    .status(HttpStatus.StatusCodes.BAD_REQUEST)
                    .json({ message: "missing query parameters" });
            }
        } catch (error) {
            // console.log(error);
            res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "error" });
        }
    };
};