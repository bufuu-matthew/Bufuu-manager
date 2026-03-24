import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../backend.d";
import { useActor } from "./useActor";

export function useAccounts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAccounts(0n);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMessages(0n, 100n);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMessagesByAccount(accountId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages", "account", accountId?.toString()],
    queryFn: async () => {
      if (!actor || !accountId) return [];
      return actor.listMessagesByAccount(accountId);
    },
    enabled: !!actor && !isFetching && accountId !== null,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: Post) => {
      if (!actor) throw new Error("No actor");
      return actor.createPost(post);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useMarkRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isRead }: { id: bigint; isRead: boolean }) => {
      if (!actor) throw new Error("No actor");
      return actor.markMessageRead(id, isRead);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useMarkStarred() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      isStarred,
    }: { id: bigint; isStarred: boolean }) => {
      if (!actor) throw new Error("No actor");
      return actor.markMessageStarred(id, isStarred);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedData();
    },
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}
