import * as express from 'express';
import * as  HttpStatus from 'http-status-codes';
import *  as url from 'url';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

export class UserController {
    userRepository: Repository<User>;
    router: any;
    constructor(userRepository: Repository<User>) {

        this.userRepository = userRepository;
        this.router = express.Router();
        this.router.post('/', this.addUser);
        this.router.get('/', this.getUserByEmail)
        this.router.delete('/', this.deleteUser);
    }
    addUser = async (req, res) => {
        const user = req.body;
        if (user && user.firstName && user.lastName && user.email) {
            try {
                await this.userRepository.save(user);
                res.status(HttpStatus.StatusCodes.OK).json({ message: 'ok' });
            } catch (error) {
                // console.log(error)
                if (error.code)
                    switch (error.code) {
                        case '23505':
                            res
                                .status(HttpStatus.StatusCodes.CONFLICT)
                                .json({ message: 'mail address alreay registred' });
                            break;
                        default:
                            res
                                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                                .json({ message: 'error' });
                            break;
                    }
            }
        } else {
            res
                .status(HttpStatus.StatusCodes.BAD_REQUEST)
                .json({ message: 'missing query parameters' });
        }
    };
    getUserByEmail = async (req, res) => {
        const { email } = url.parse(req.url, true).query;

        if (email) {
            try {
                const user = await this.userRepository
                    .createQueryBuilder('user')
                    .where('user.email = :email', { email })
                    .getOne();
                if (user) {
                    res.status(HttpStatus.StatusCodes.OK).json(user);
                } else {
                    // post not found
                    res
                        .status(HttpStatus.StatusCodes.NOT_FOUND)
                        .json({ message: 'user not found' });
                }
            } catch (error) {
                // console.log(error);
                res
                    .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error' });
            }
        } else {
            res
                .status(HttpStatus.StatusCodes.BAD_REQUEST)
                .json({ message: 'missing query parameters' });
        }
    };
    deleteUser = async (req, res) => {
        const { id } = url.parse(req.url, true).query;
        if (id) {
            this.userRepository
                .createQueryBuilder()
                .delete()
                .from(User)
                .where('id = :id', { id })
                .execute();
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'deleted' });
        } else {
            res
                .status(HttpStatus.StatusCodes.BAD_REQUEST)
                .json({ message: 'missing query parameters' });
        }
    };
}