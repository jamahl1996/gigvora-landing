import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type AIType =
  | 'profile-insights'
  | 'writing-assist'
  | 'smart-match'
  | 'message-draft'
  | 'content-moderate'
  | 'gig-pricing'
  | 'candidate-rank'
  | 'job-enrichment'
  | 'prospect-score'
  | 'thread-summary'
  | 'chat';

interface UseAIOptions {
  type: AIType;
  onError?: (error: string) => void;
}

export const useAI = ({ type, onError }: UseAIOptions) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const invoke = useCallback(async (context: any) => {
    setLoading(true);
    try {
      const endpoint = import.meta.env.VITE_AI_ASSISTANT_URL as string | undefined;
      if (!endpoint) {
        const msg = 'AI assistant is not configured.';
        if (onError) onError(msg);
        else toast.info(msg);
        setResult(null);
        return null;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context }),
      });

      if (!response.ok) throw new Error(`AI request failed: ${response.status}`);

      const data = await response.json();
      if (data?.error) {
        if (onError) onError(data.error);
        else toast.error(data.error);
        return null;
      }

      setResult(data?.result || null);
      return data?.result || null;
    } catch (err: any) {
      const msg = err.message || 'AI request failed';
      if (onError) onError(msg);
      else toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [type, onError]);

  return { result, loading, invoke, setResult };
};
