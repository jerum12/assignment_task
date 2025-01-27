'use client'
import React, { useEffect, useState } from 'react'
import { Column,  flexRender, getCoreRowModel, Row, useReactTable} from '@tanstack/react-table'
import { supabase } from '@/lib/supabase'
import { ColumnProps, Employee } from '@/types'
import { Loader } from 'react-feather'
import AddEmployeeDialog from './AddEmployeeDialog'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import ConfirmationModal from '@/components/Confirmation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'





const columns = (handleEdit: (rowData: Employee) => void, handleDelete: (id: string) => void) => [
  {
    footer: (props: ColumnProps) => props.column.id,
    accessorKey: 'name',
    enableColumnFilter: false,
    header: ({ column }: { column: Column<Employee> }) => (
        <div
          className="text-[12px] font-bold uppercase text-q cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Name {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '▲' : '▼') : ''}
        </div>
      ),
    cell: ({ row }: { row: Row<Employee> }) => {
        const rowData = row.original || {}
        return (
          <div className="text-[12px] font-semibold uppercase text-black">
            {rowData.name || 'N/A'}
          </div>
        )
      },
  },
  {
    footer: (props: ColumnProps) => props.column.id,
    accessorKey: 'address',
    enableColumnFilter: false,
    header: ({ column }: { column: Column<Employee> }) => (
        <div
          className="text-[12px] font-bold uppercase text-q cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Address {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '▲' : '▼') : ''}
        </div>
      ),
    cell: ({ row }: { row: Row<Employee> }) => {
        const rowData = row.original || {}
        return (
          <div className="text-[12px] font-semibold uppercase text-black">
            {rowData.address || 'N/A'}
          </div>
        )
      },
  },
  {
    footer: (props: ColumnProps) => props.column.id,
    accessorKey: 'contact',
    enableColumnFilter: false,
    header: ({ column }: { column: Column<Employee> }) => (
        <div
          className="text-[12px] font-bold uppercase text-q cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Contact Number {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '▲' : '▼') : ''}
        </div>
      ),
    cell: ({ row }: { row: Row<Employee> }) => {
        const rowData = row.original || {}
        return (
          <div className="text-[12px] font-semibold uppercase text-black">
            {rowData.contact || 'N/A'}
          </div>
        )
      },
  },
  {
    footer: (props: ColumnProps) => props.column.id,
    accessorKey: 'age',
    enableColumnFilter: false,
    header: ({ column }: { column: Column<Employee> }) => (
        <div
          className="text-[12px] font-bold uppercase text-q cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Age {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '▲' : '▼') : ''}
        </div>
      ),
    cell: ({ row }: { row: Row<Employee> }) => {
        const rowData = row.original || {}
        return (
          <div className="text-[12px] font-semibold uppercase text-black">
            {rowData.age || 'N/A'}
          </div>
        )
      },
  },
  {
    footer: (props: ColumnProps) => props.column.id,
    accessorKey: 'gender',
    enableColumnFilter: false,
    header: ({ column }: { column: Column<Employee> }) => (
        <div
          className="text-[12px] font-bold uppercase text-q cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Gender {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '▲' : '▼') : ''}
        </div>
      ),
    cell: ({ row }: { row: Row<Employee> }) => {
        const rowData = row.original || {}
        return (
          <div className="text-[12px] font-semibold uppercase text-black">
            {rowData.gender || 'N/A'}
          </div>
        )
      },
  },
  {
    footer: (props: ColumnProps) => props.column.id,
    accessorKey: 'actions',
    header: () => (
      <div className="text-center text-[12px] font-bold uppercase text-q">
        Action
      </div>
    ),
    cell: ({ row }: { row: Row<Employee>}) => {
        const rowData = row.original || {}; // Safely fallback to an empty object if row.original is null or undefined
        const { id } = rowData; // Now destructure safely
        const finalId = id ?? "default-id";

      return (
        <div className="flex justify-center gap-2">
          <Button
            className="flex items-center gap-2 border-blue-700 bg-white shadow py-1 px-3 text-blue-700  hover:bg-blue-200 transition duration-200"
            onClick={() => handleEdit(rowData)}
          >
           <FontAwesomeIcon icon={faEdit} /> Edit
          </Button>
          <Button
            className="flex items-center gap-2 border-red-700 bg-white shadow py-1 px-3 text-red-700  hover:bg-red-200 transition duration-200"
            onClick={() => handleDelete(finalId)}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </div>
      )
    },
  },
]


const EmployeeTable: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);  // Track dialog visibility
    const [type, setType] = useState('add');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [deleteEmployee, setDeleteEmployee] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0); // Starts at page 0 (zero-indexed)
    const [pageSize, setPageSize] = useState(10); // Default to 10 records per page
    const [totalCount, setTotalCount] = useState(0); // Total number of records

    
    const fetchEmployees = async (pageIndex: number, pageSize: number) => {
        setLoading(true);
      
        // Calculate the range for the current page
        const start = pageIndex * pageSize;
        const end = start + pageSize - 1;
      
        // Fetch employees with Supabase, including the total count
        const { data, error, count } = await supabase
          .from('employees')
          .select('*', { count: 'exact' }) // Fetch data and total count
          .order('name', { ascending: true })
          .range(start, end); // Fetch only the data for the current page
      
        if (error) {
          toast.error(`Error fetching employees: ${error.message}!`);
        } else {
          setEmployees(data || []); // Update the employee state
          setTotalCount(count || 0); // Update the total count state
        }
      
        setLoading(false);
      };
      
  
    
    const handleAddEmp = () => {
        setType('add');
        setEditingEmployee(null)
        setIsDialogOpen(true)  // Open dialog when edit button is clicked
      }

    // Handle adding a new employee
    const handleAdd = async (newEmployee: Employee) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(newEmployee)
        .select()
  
      if (!error && data) {
        setEmployees(prev => [...prev, newEmployee])
        setTotalCount((prev) => prev + data.length); // Recompute total records
        toast.success('Employee added successfully!');
        return true
      } else {
        toast.error(error?.message || 'Error adding employee!')
        return false
      }
    }
  
    // Handle editing an existing employee
    const handleEdit = (employee: Employee) => {
      setType('edit');
      setEditingEmployee(employee)
      setIsDialogOpen(true)  // Open dialog when edit button is clicked
    }

  
    // Handle updating the employee (update their data)
    const handleUpdate = async (updatedEmployee: Employee) => {

      if (!updatedEmployee.id) {
       toast.error('Error: Employee ID is missing or invalid!')
        return false
      }
  
      const { error } = await supabase
      .from('employees')  // Specify the table and the Employee type
      .update(updatedEmployee)
      .eq('id', updatedEmployee.id)
      .single();

      if (error) {
        toast.error(`Error updating employee: ${error.message}!`)
      } else {
        setEmployees((prevEmp) =>
            prevEmp.map((t) => (t.id === updatedEmployee?.id ? updatedEmployee : t))
          );
        setEditingEmployee(null)
        toast.success('Employee updated successfully!')
        return true
      }
      return false
    }
  
    
    const handleDeleteEmp = (employeeId: string) => {
        setDeleteEmployee(employeeId);
        setShowDeleteModal(true);
    };

      // Delete 
  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('employees').delete().eq('id', deleteEmployee);
    if (!error) {
      setEmployees((prevEmp) => prevEmp.filter((e) => e.id !== deleteEmployee));
      setTotalCount((prev) => prev - 1); // Decrement totalCount by 1
      toast.success('Employee deleted successfully!');
    } else {
      toast.error('Error deleting employee!');
    }

    setShowDeleteModal(false);
    setIsLoading(false);
  };

  
  useEffect(() => {
    fetchEmployees(currentPage, pageSize); // Fetch data for the current page and page size
  }, [currentPage, pageSize]);
  
  const table = useReactTable({
    data: employees, // Current page data
    columns: columns(handleEdit, handleDeleteEmp),
    pageCount: Math.ceil(totalCount / pageSize), // Calculate total pages
    manualPagination: true, // Enable server-side pagination
    state: {
      pagination: {
        pageIndex: currentPage, // Current page
        pageSize, // Page size
      },
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
      setCurrentPage(newState.pageIndex); // Update current page
      setPageSize(newState.pageSize); // Update page size
    },
    getCoreRowModel: getCoreRowModel(),
  });
  
    return (
      <div className="">
    
        <div className="flex items-center justify-between mb-4">
            <Button
            onClick={handleAddEmp}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded cursor-pointer"
            disabled={loading}
            >
            Add Employee
            </Button>
            <div className="text-sm font-medium text-gray-600">
            Total Records: <span className="font-bold text-black">{totalCount}</span>
            </div>
        </div>
        {/* Add/Edit Dialog */}
        <AddEmployeeDialog
          onAddEmployee={handleAdd}
          onUpdateEmployee={handleUpdate}
          employee={editingEmployee}  // Pass the employee to edit
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}  // Pass state setter to close the dialog
          type={type}
        />

        {/* Table displaying employees */}
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className='bg-green-100'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr className="mt-4">
                <td colSpan={6}>
                  <div className="flex justify-center">
                    <Loader className="animate-spin" size={50} />
                  </div>
                </td>
              </tr>
            ) : 
                table.getRowModel().rows.length === 0 ? 
                    <tr className="mt-4">
                        <td colSpan={6}>
                        <div className="flex justify-center">
                            No Records Retrieve!
                        </div>
                        </td>
                    </tr>
                :
                (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between">
            <Button
                onClick={() => table.previousPage()} // Go to the previous page
                disabled={!table.getCanPreviousPage()} // Disable if no previous page
                className="px-4 py-2 bg-green-300 hover:bg-green-500 text-black rounded cursor-pointer"
            >
                Previous
            </Button>
            <span>
                {table.getPageCount() > 0
                    ? `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
                    : `Page  0 of 0`}
                </span>
            <Button
                onClick={() => table.nextPage()} // Go to the next page
                disabled={!table.getCanNextPage()} // Disable if no next page
                className="px-4 py-2 bg-green-300 hover:bg-green-500 text-black rounded cursor-pointer"
            >
                Next
            </Button>
        </div>


        {showDeleteModal && (
        <ConfirmationModal
          title="Delete Employee"
          isLoading={isLoading}
          open={showDeleteModal}
          setShowModal={() => setShowDeleteModal(false)}
          description="Are you sure you want to delete this employee? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      </div>
    )
  }

export default EmployeeTable