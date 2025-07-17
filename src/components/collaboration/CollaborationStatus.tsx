
import React from "react";
import { Users, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";

interface CollaborationStatusProps {
  circuitId: string | null;
}

export function CollaborationStatus({ circuitId }: CollaborationStatusProps) {
  const { activeUsers, recentChanges, isConnected } = useRealtimeCollaboration(circuitId);

  if (!circuitId) return null;

  return (
    <Card className="quantum-panel border-quantum-glow/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-quantum-glow" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-quantum-glow" />
              <span className="text-sm">
                {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            {activeUsers.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-quantum-glow/20 border border-quantum-glow/30 flex items-center justify-center text-xs font-medium text-quantum-glow"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-quantum-matrix/20 border border-quantum-glow/30 flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
        </div>

        {recentChanges.length > 0 && (
          <div className="mt-3 pt-3 border-t border-quantum-glow/20">
            <div className="text-xs text-muted-foreground mb-2">Recent Activity</div>
            <div className="space-y-1">
              {recentChanges.slice(0, 3).map((change, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    {change.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-muted-foreground truncate">
                    User performed {change.type.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
