import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserPostCommentTables1612126838736 implements MigrationInterface {
    name = 'createUserPostCommentTables1612126838736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `post` (`id` int NOT NULL AUTO_INCREMENT, `date` datetime NOT NULL, `content` varchar(255) NOT NULL, `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `comment` (`id` int NOT NULL AUTO_INCREMENT, `date` datetime NOT NULL, `content` varchar(255) NOT NULL, `userId` int NOT NULL, `responseToCommentId` int NULL, `postId` int NOT NULL, UNIQUE INDEX `REL_dad636cb4c7a9b3ec6d2e56fac` (`responseToCommentId`), UNIQUE INDEX `REL_94a85bb16d24033a2afdd5df06` (`postId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_5c1cf55c308037b5aca1038a131` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_dad636cb4c7a9b3ec6d2e56fac9` FOREIGN KEY (`responseToCommentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_94a85bb16d24033a2afdd5df060` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_94a85bb16d24033a2afdd5df060`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_dad636cb4c7a9b3ec6d2e56fac9`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`");
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_5c1cf55c308037b5aca1038a131`");
        await queryRunner.query("DROP INDEX `REL_94a85bb16d24033a2afdd5df06` ON `comment`");
        await queryRunner.query("DROP INDEX `REL_dad636cb4c7a9b3ec6d2e56fac` ON `comment`");
        await queryRunner.query("DROP TABLE `comment`");
        await queryRunner.query("DROP TABLE `post`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
