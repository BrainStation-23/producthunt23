
import React from 'react';

const AssignmentManager: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Product Assignments</h3>
        <p className="text-muted-foreground">Assign products to judges for evaluation.</p>
      </div>
      
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">This feature will be implemented in the next phase.</p>
        <p className="text-muted-foreground mt-2">You'll be able to assign products to judges and track progress here.</p>
      </div>
    </div>
  );
};

export default AssignmentManager;
