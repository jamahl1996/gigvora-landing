/**
 * Phase 9.2 — CreateProposalDialog
 *
 * Form-driven dialog wired to useCreateProposal mutation. Zod-validated
 * via the shared proposalCreateSchema; surfaces field errors inline.
 */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateProposal } from '@/lib/data/proposals';

interface Props {
  trigger?: React.ReactNode;
  defaultProjectId?: string;
}

export function CreateProposalDialog({ trigger, defaultProjectId }: Props) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(defaultProjectId ?? '');
  const [coverNote, setCoverNote] = useState('');
  const [bid, setBid] = useState('');
  const [days, setDays] = useState('');
  const create = useCreateProposal();

  function reset() {
    setProjectId(defaultProjectId ?? '');
    setCoverNote(''); setBid(''); setDays('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync({
        project_id: projectId.trim(),
        cover_note: coverNote.trim(),
        bid_amount_cents: bid ? Math.round(Number(bid) * 100) : null,
        currency: 'USD',
        timeline_days: days ? Number(days) : null,
        attachments: [],
      });
      toast.success('Proposal submitted');
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm" className="h-7 text-[10px] gap-1"><Send className="h-3 w-3" /> Submit Proposal</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Submit Proposal</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="prop-pid" className="text-xs">Project ID</Label>
            <Input id="prop-pid" required value={projectId} onChange={e => setProjectId(e.target.value)}
              placeholder="UUID of the project you're bidding on" className="text-xs" />
          </div>
          <div>
            <Label htmlFor="prop-note" className="text-xs">Cover note</Label>
            <Textarea id="prop-note" required minLength={20} value={coverNote} onChange={e => setCoverNote(e.target.value)}
              placeholder="Why you're the right fit, relevant experience, and approach" rows={5} className="text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prop-bid" className="text-xs">Bid (USD)</Label>
              <Input id="prop-bid" type="number" min={0} step="0.01" value={bid} onChange={e => setBid(e.target.value)} className="text-xs" />
            </div>
            <div>
              <Label htmlFor="prop-days" className="text-xs">Timeline (days)</Label>
              <Input id="prop-days" type="number" min={1} value={days} onChange={e => setDays(e.target.value)} className="text-xs" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}