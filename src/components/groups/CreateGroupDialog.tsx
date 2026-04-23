/**
 * Phase 9.2 — CreateGroupDialog
 *
 * Wired to useCreateGroup; auto-joins the creator via the RLS-safe
 * group_members insert.
 */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateGroup, useJoinGroup } from '@/lib/data/groups';

interface Props { trigger?: React.ReactNode }

export function CreateGroupDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'secret'>('public');
  const [category, setCategory] = useState('');
  const create = useCreateGroup();
  const join = useJoinGroup();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await create.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        visibility,
        tags: [],
        category: category.trim() || null,
      });
      // Auto-join creator (owner)
      if (created?.id) await join.mutateAsync(created.id).catch(() => undefined);
      toast.success('Group created');
      setName(''); setDescription(''); setCategory(''); setVisibility('public');
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm" className="h-7 text-[10px] gap-1"><Plus className="h-3 w-3" /> Create Group</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Create Group</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="grp-name" className="text-xs">Group name</Label>
            <Input id="grp-name" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} className="text-xs" />
          </div>
          <div>
            <Label htmlFor="grp-desc" className="text-xs">Description</Label>
            <Textarea id="grp-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="grp-cat" className="text-xs">Category</Label>
              <Input id="grp-cat" value={category} onChange={e => setCategory(e.target.value)} placeholder="Technology, Career, …" className="text-xs" />
            </div>
            <div>
              <Label className="text-xs">Visibility</Label>
              <Select value={visibility} onValueChange={v => setVisibility(v as typeof visibility)}>
                <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — anyone can find</SelectItem>
                  <SelectItem value="private">Private — visible, request to join</SelectItem>
                  <SelectItem value="secret">Secret — invite only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}