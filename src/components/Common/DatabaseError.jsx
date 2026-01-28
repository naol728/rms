import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw } from 'lucide-react';

const DatabaseError = ({ onRetry, message = "Database connection failed. Please check your connection and try again." }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Alert className="max-w-md border-red-200 bg-red-50">
        <Database className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="space-y-3">
            <p className="font-medium">Database Connection Error</p>
            <p className="text-sm">{message}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DatabaseError;
