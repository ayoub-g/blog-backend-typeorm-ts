import 'reflect-metadata';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { createConnection, getConnectionOptions, } from 'typeorm';
import { UserController } from './controller/userController';
import { PostController } from './controller/postController';
import { CommentController } from './controller/commentController';

import { User } from './entity/User';
import { Post } from './entity/Post';
import { Comment } from './entity/Comment';
(async () => {
    const PORT = 3000;
    const config = await getConnectionOptions('development')
    const con = await createConnection({ ...config, name: 'default' });
    const app = express();
    const server = http.createServer(app);
    console.log('connected to mysql server');
    const userController = new UserController(con.getRepository(User));
    const postController = new PostController(con.getRepository(Post));
    const commentController = new CommentController(con.getRepository(Comment));

    app.use(
        express.json({
            verify: (req, res, buf) => {
                try {
                    JSON.parse(buf);
                } catch (e) {
                    res
                        .status(400)
                        .send('{message: the request is not in the json format}');
                    throw Error('invalid JSON');
                }
            },
        })
    );
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(
        bodyParser.urlencoded({
            limit: '1mb',
            extended: true,
            parameterLimit: 20,
        })
    );
    // error handler
    app.use((err, req, res, next) => {
        // const  fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        // console.log(fullUrl);
        if (err.name === 'ValidationError') {
            const valErrors = [];
            Object.keys(err.errors).forEach((key) =>
                valErrors.push(err.errors[key].message)
            );
            res.status(422).send(valErrors);
        }
    });

    app.use('/api/user', userController.router);
    app.use('/api/post', postController.router);
    app.use('/api/comment', commentController.router);


    server.listen(PORT, () => {
        console.log(`server started at port: ${PORT}`);
    });
})()
