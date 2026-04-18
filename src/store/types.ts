// Store interfaces — host apps implement these for custom persistence (Postgres, Supabase, etc.)
// SQLite implementations in conversation-store.ts and summary-store.ts are the reference.

import type {
  ConversationRecord,
  CreateConversationInput,
  ConversationId,
  MessageRecord,
  CreateMessageInput,
  MessageId,
  MessageRole,
  MessagePartRecord,
  CreateMessagePartInput,
  MessageSearchInput,
  MessageSearchResult,
} from "./conversation-store.js";

import type {
  SummaryRecord,
  CreateSummaryInput,
  SummarySubtreeNodeRecord,
  SummarySearchInput,
  SummarySearchResult,
  ContextItemRecord,
  LargeFileRecord,
  CreateLargeFileInput,
  UpsertConversationBootstrapStateInput,
  ConversationBootstrapStateRecord,
} from "./summary-store.js";

export interface IConversationStore {
  withTransaction<T>(operation: () => Promise<T> | T): Promise<T>;

  // Conversations
  createConversation(
    input: CreateConversationInput,
  ): Promise<ConversationRecord>;
  getConversation(
    conversationId: ConversationId,
  ): Promise<ConversationRecord | null>;
  getConversationBySessionId(
    sessionId: string,
  ): Promise<ConversationRecord | null>;
  getOrCreateConversation(
    sessionId: string,
    title?: string,
  ): Promise<ConversationRecord>;
  markConversationBootstrapped(conversationId: ConversationId): Promise<void>;

  // Messages
  createMessage(input: CreateMessageInput): Promise<MessageRecord>;
  createMessagesBulk(inputs: CreateMessageInput[]): Promise<MessageRecord[]>;
  getMessages(
    conversationId: ConversationId,
    opts?: { afterSeq?: number; limit?: number },
  ): Promise<MessageRecord[]>;
  getLastMessage(conversationId: ConversationId): Promise<MessageRecord | null>;
  hasMessage(
    conversationId: ConversationId,
    role: MessageRole,
    content: string,
  ): Promise<boolean>;
  countMessagesByIdentity(
    conversationId: ConversationId,
    role: MessageRole,
    content: string,
  ): Promise<number>;
  getMessageById(messageId: MessageId): Promise<MessageRecord | null>;
  getMessageCount(conversationId: ConversationId): Promise<number>;
  getMaxSeq(conversationId: ConversationId): Promise<number>;

  // Message parts
  createMessageParts(
    messageId: MessageId,
    parts: CreateMessagePartInput[],
  ): Promise<void>;
  getMessageParts(messageId: MessageId): Promise<MessagePartRecord[]>;

  // Deletion
  deleteMessages(messageIds: MessageId[]): Promise<number>;

  // Search
  searchMessages(input: MessageSearchInput): Promise<MessageSearchResult[]>;
}

export interface ISummaryStore {
  // Summary CRUD
  insertSummary(input: CreateSummaryInput): Promise<SummaryRecord>;
  getSummary(summaryId: string): Promise<SummaryRecord | null>;
  getSummariesByConversation(conversationId: number): Promise<SummaryRecord[]>;

  // Lineage
  linkSummaryToMessages(summaryId: string, messageIds: number[]): Promise<void>;
  linkSummaryToParents(
    summaryId: string,
    parentSummaryIds: string[],
  ): Promise<void>;
  getSummaryMessages(summaryId: string): Promise<number[]>;
  getSummaryChildren(parentSummaryId: string): Promise<SummaryRecord[]>;
  getSummaryParents(summaryId: string): Promise<SummaryRecord[]>;
  getSummarySubtree(summaryId: string): Promise<SummarySubtreeNodeRecord[]>;

  // Context items
  getContextItems(conversationId: number): Promise<ContextItemRecord[]>;
  getDistinctDepthsInContext(
    conversationId: number,
    options?: { maxOrdinalExclusive?: number },
  ): Promise<number[]>;
  appendContextMessage(
    conversationId: number,
    messageId: number,
  ): Promise<void>;
  appendContextMessages(
    conversationId: number,
    messageIds: number[],
  ): Promise<void>;
  appendContextSummary(
    conversationId: number,
    summaryId: string,
  ): Promise<void>;
  replaceContextRangeWithSummary(input: {
    conversationId: number;
    startOrdinal: number;
    endOrdinal: number;
    summaryId: string;
  }): Promise<void>;
  getContextTokenCount(conversationId: number): Promise<number>;

  // Search
  searchSummaries(input: SummarySearchInput): Promise<SummarySearchResult[]>;

  // Large files
  insertLargeFile(input: CreateLargeFileInput): Promise<LargeFileRecord>;
  getLargeFile(fileId: string): Promise<LargeFileRecord | null>;
  getLargeFilesByConversation(
    conversationId: number,
  ): Promise<LargeFileRecord[]>;

  // Bootstrap state
  upsertConversationBootstrapState(
    input: UpsertConversationBootstrapStateInput,
  ): Promise<void>;
  getConversationBootstrapState(
    conversationId: number,
  ): Promise<ConversationBootstrapStateRecord | null>;
}
