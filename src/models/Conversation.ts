import { BaseEntity, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';
import { Message } from './Message';

@Entity()
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, user => user.conversations)
  participants: User[];

  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];
}
