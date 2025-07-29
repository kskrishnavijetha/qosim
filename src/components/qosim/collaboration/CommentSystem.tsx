
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';

interface CommentSystemProps {
  comments: any[];
  onCommentsUpdate: (comments: any[]) => void;
}

export function CommentSystem({ comments, onCommentsUpdate }: CommentSystemProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Inline comments and code reviews
      </div>

      <div className="space-y-2">
        <Textarea 
          placeholder="Add a comment..."
          className="text-sm"
          rows={2}
        />
        <Button size="sm" className="w-full">
          <Send className="w-4 h-4 mr-2" />
          Add Comment
        </Button>
      </div>

      {comments.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div>No comments yet</div>
          <div className="text-xs">Start a discussion</div>
        </div>
      )}
    </div>
  );
}
