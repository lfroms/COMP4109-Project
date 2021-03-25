import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Conversation } from './Conversation';
import { User } from './User';

@Entity()
@Index(['user', 'conversation'], { unique: true })
export class PersonalConversationKey extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;

  @Column()
  value: string;

  @Column()
  hmacKey: string;
}
