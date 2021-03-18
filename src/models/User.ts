import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Conversation } from './Conversation';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  publicKey: string;

  @ManyToMany(() => Conversation, conversation => conversation.participants)
  @JoinTable()
  conversations: Conversation[];
}
