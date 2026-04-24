import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  taskUpsertSchema,
  type TaskUpsertInput,
  milestoneUpsertSchema,
  type MilestoneUpsertInput,
  deliverableUpsertSchema,
  type DeliverableUpsertInput,
  timeEntryUpsertSchema,
  type TimeEntryUpsertInput,
} from '@/lib/schemas/work';
import type { Tables, TablesInsert, TablesUpdate, Json } from '@/integrations/supabase/types';

export type TaskRow = any;
export type MilestoneRow = any;
export type DeliverableRow = Tables<'deliverables'>;
export type TimeEntryRow = Tables<'time_entries'>;

/* ----------------------------- Tasks ----------------------------- */

export function useProjectTasks(projectId: string | null | undefined) {
  return useQuery({
    queryKey: projectId ? qk.tasks.byProject(projectId) : ['tasks', 'byProject', 'none'],
    enabled: Boolean(projectId),
    queryFn: async (): Promise<TaskRow[]> => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId!)
        .order('position', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyAssignedTasks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: user?.id ? qk.tasks.byAssignee(user.id) : ['tasks', 'byAssignee', 'none'],
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<TaskRow[]> => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', user!.id)
        .neq('status', 'done')
        .order('due_at', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateTask() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TaskUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = taskUpsertSchema.parse(input);
      const row: TablesInsert<'tasks'> = {
        ...parsed,
        title: parsed.title,
        project_id: parsed.project_id,
        created_by: user.id,
      };
      const { data, error } = await supabase.from('tasks').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.tasks.byProject(data.project_id) });
      if (data?.assignee_id) qc.invalidateQueries({ queryKey: qk.tasks.byAssignee(data.assignee_id) });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<TaskUpsertInput> & { id: string }) => {
      const parsed = taskUpsertSchema.partial().parse(input);
      const update: TablesUpdate<'tasks'> = parsed;
      const { data, error } = await supabase.from('tasks').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.tasks.byProject(data.project_id) });
      if (data?.assignee_id) qc.invalidateQueries({ queryKey: qk.tasks.byAssignee(data.assignee_id) });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return { id, projectId };
    },
    onSuccess: ({ projectId }) => {
      qc.invalidateQueries({ queryKey: qk.tasks.byProject(projectId) });
    },
  });
}

/* --------------------------- Milestones -------------------------- */

export function useProjectMilestones(projectId: string | null | undefined) {
  return useQuery({
    queryKey: projectId ? qk.milestones.byProject(projectId) : ['milestones', 'byProject', 'none'],
    enabled: Boolean(projectId),
    queryFn: async (): Promise<MilestoneRow[]> => {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId!)
        .order('position', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MilestoneUpsertInput) => {
      const parsed = milestoneUpsertSchema.parse(input);
      const row: TablesInsert<'milestones'> = {
        ...parsed,
        title: parsed.title,
        project_id: parsed.project_id,
      };
      const { data, error } = await supabase.from('milestones').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.milestones.byProject(data.project_id) });
    },
  });
}

export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<MilestoneUpsertInput> & { id: string }) => {
      const parsed = milestoneUpsertSchema.partial().parse(input);
      const update: TablesUpdate<'milestones'> = parsed;
      const { data, error } = await supabase.from('milestones').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.milestones.byProject(data.project_id) });
    },
  });
}

/* -------------------------- Deliverables ------------------------- */

export function useProjectDeliverables(projectId: string | null | undefined) {
  return useQuery({
    queryKey: projectId ? qk.deliverables.byProject(projectId) : ['deliverables', 'byProject', 'none'],
    enabled: Boolean(projectId),
    queryFn: async (): Promise<DeliverableRow[]> => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project_id', projectId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSubmitDeliverable() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeliverableUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = deliverableUpsertSchema.parse(input);
      const row: TablesInsert<'deliverables'> = {
        ...parsed,
        title: parsed.title,
        project_id: parsed.project_id,
        submitted_by: user.id,
        files: parsed.files as unknown as Json,
        links: parsed.links as unknown as Json,
      };
      const { data, error } = await supabase.from('deliverables').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.deliverables.byProject(data.project_id) });
    },
  });
}

export function useReviewDeliverable() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      review_notes,
    }: {
      id: string;
      status: 'approved' | 'rejected' | 'revision_requested';
      review_notes?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const update: TablesUpdate<'deliverables'> = {
        status,
        review_notes: review_notes ?? null,
        reviewer_id: user.id,
        reviewed_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('deliverables')
        .update(update)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.deliverables.byProject(data.project_id) });
    },
  });
}

/* -------------------------- Time entries ------------------------- */

export function useMyTimeEntries() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.timeEntries.me,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<TimeEntryRow[]> => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProjectTimeEntries(projectId: string | null | undefined) {
  return useQuery({
    queryKey: projectId ? qk.timeEntries.byProject(projectId) : ['timeEntries', 'byProject', 'none'],
    enabled: Boolean(projectId),
    queryFn: async (): Promise<TimeEntryRow[]> => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('project_id', projectId!)
        .order('started_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLogTimeEntry() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TimeEntryUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = timeEntryUpsertSchema.parse(input);
      const row: TablesInsert<'time_entries'> = {
        ...parsed,
        project_id: parsed.project_id,
        started_at: parsed.started_at,
        user_id: user.id,
      };
      const { data, error } = await supabase.from('time_entries').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.timeEntries.me });
      if (data?.project_id) qc.invalidateQueries({ queryKey: qk.timeEntries.byProject(data.project_id) });
    },
  });
}
