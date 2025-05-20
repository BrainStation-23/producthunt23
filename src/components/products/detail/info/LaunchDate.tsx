
import React from 'react';

interface LaunchDateProps {
  date: string | undefined;
}

const LaunchDate: React.FC<LaunchDateProps> = ({ date }) => {
  if (!date) return null;
  
  const formattedDate = new Date(date).toLocaleDateString();
  
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">Launched</h3>
      <p className="text-sm">{formattedDate}</p>
    </div>
  );
};

export default LaunchDate;
