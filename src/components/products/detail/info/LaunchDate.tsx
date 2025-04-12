
import React from 'react';

interface LaunchDateProps {
  date: string | undefined;
}

const LaunchDate: React.FC<LaunchDateProps> = ({ date }) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Launched</h3>
      <p className="text-sm text-muted-foreground">
        {date ? new Date(date).toLocaleDateString() : ''}
      </p>
    </div>
  );
};

export default LaunchDate;
