import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type MessageId = bigint;
export interface Post {
    id: PostId;
    status: string;
    content: string;
    createdAt: bigint;
    targetAccountIds: Array<AccountId>;
}
export type PostId = bigint;
export interface SocialMediaAccount {
    id: AccountId;
    status: string;
    clientName: string;
    lastActivity: bigint;
    name: string;
    platform: string;
    email: string;
}
export interface Message {
    id: MessageId;
    accountId: AccountId;
    subject: string;
    isStarred: boolean;
    preview: string;
    platform: string;
    isRead: boolean;
    sender: string;
    timestamp: bigint;
}
export interface DashboardStats {
    disconnectedCount: bigint;
    unreadMessageCount: bigint;
    activeCount: bigint;
    totalAccounts: bigint;
}
export interface UserProfile {
    name: string;
}
export type AccountId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAccount(account: SocialMediaAccount): Promise<AccountId>;
    createMessage(message: Message): Promise<MessageId>;
    createPost(post: Post): Promise<PostId>;
    deleteAccount(accountId: AccountId): Promise<void>;
    getAccount(accountId: AccountId): Promise<SocialMediaAccount>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getMessage(messageId: MessageId): Promise<Message>;
    getPost(postId: PostId): Promise<Post>;
    getUnreadCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAccounts(accountId: AccountId): Promise<Array<SocialMediaAccount>>;
    listMessages(startFrom: bigint, pageSize: bigint): Promise<Array<Message>>;
    listMessagesByAccount(accountId: AccountId): Promise<Array<Message>>;
    listPosts(): Promise<Array<Post>>;
    markMessageRead(messageId: MessageId, isRead: boolean): Promise<void>;
    markMessageStarred(messageId: MessageId, isStarred: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedData(): Promise<void>;
    updateAccountStatus(accountId: AccountId, newStatus: string): Promise<void>;
    updatePostStatus(postId: PostId, newStatus: string): Promise<void>;
}
