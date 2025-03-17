
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';

const AdminProducts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage all products on the platform.</p>
        </div>
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Published</Button>
          <Button variant="outline" size="sm">Pending</Button>
          <Button variant="outline" size="sm">Rejected</Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">No products found</TableCell>
              <TableCell><Badge variant="outline">-</Badge></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Products will appear here once Supabase is connected
        </p>
      </div>
    </div>
  );
};

export default AdminProducts;
