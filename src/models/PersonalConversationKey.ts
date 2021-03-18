import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Conversation } from './Conversation';
import { User } from './User';

@Entity()
export class PersonalConversationKey extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;

  @Column()
  value: string;
}
