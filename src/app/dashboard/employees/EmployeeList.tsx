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
    const [pageSize, setPageSize] = useState(5); // Default to 10 records per page
    const [totalCount, setTotalCount] = useState(0); // Total number of records

    
    
  const fetchEmployees = async (pageIndex: number, pageSize: number, sortBy: { id: string; desc: boolean }[]) => {
    if (loading) return;  

    setLoading(true);  

    const start = pageIndex * pageSize;
    const end = start + pageSize - 1;

    let sortColumn = 'name'; 
    let isDescending = false; 

    if (sortBy.length > 0) {
        sortColumn = sortBy[0].id; 
        isDescending = sortBy[0].desc; 
    }

    try {
      const { data, error, count } = await supabase
        .from('employees')
        .select('*', { count: 'exact' })
        .order(sortColumn, { ascending: !isDescending })
        .range(start, end); 

      if (error) {
        toast.error(`Error fetching employees: ${error.message}!`);
      } else {
        setEmployees(data || []); 
        setTotalCount(count || 0); 
      }
    } catch (error) {
      toast.error(`Error fetching employees: ${error || 'Unknown error'}`);
    } finally {
      setLoading(false);  
    }
  };

  
  const handleAddEmp = () => {
    setType('add');
    setEditingEmployee(null)
    setIsDialogOpen(true)  
  }

  const handleAdd = async (newEmployee: Employee) => {
    const { data, error } = await supabase
      .from('employees')
      .insert(newEmployee)
      .select()

    if (!error && data) {
      setEmployees(prev => [...prev, newEmployee])
      setTotalCount((prev) => prev + data.length); 
      toast.success('Employee added successfully!');
      return true
    } else {
      toast.error(error?.message || 'Error adding employee!')
      return false
    }
  }

  const handleEdit = (employee: Employee) => {
    setType('edit');
    setEditingEmployee(employee)
    setIsDialogOpen(true)  
  }

  const handleUpdate = async (updatedEmployee: Employee) => {
    if (!updatedEmployee.id) {
      toast.error('Error: Employee ID is missing or invalid!')
      return false
    }

    const { error } = await supabase
      .from('employees') 
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

  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('employees').delete().eq('id', deleteEmployee);
    if (!error) {
      setEmployees((prevEmp) => prevEmp.filter((e) => e.id !== deleteEmployee));
      setTotalCount((prev) => prev - 1); 
      toast.success('Employee deleted successfully!');
    } else {
      toast.error('Error deleting employee!');
    }

    setShowDeleteModal(false);
    setIsLoading(false);
  };

  const table = useReactTable({
    data: employees, 
    columns: columns(handleEdit, handleDeleteEmp),
    pageCount: Math.ceil(totalCount / pageSize), 
    manualPagination: true, 
    state: {
      pagination: {
        pageIndex: currentPage, 
        pageSize, 
      },
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
      setCurrentPage(newState.pageIndex); 
      setPageSize(newState.pageSize); 
    },
    getCoreRowModel: getCoreRowModel(),
  });

  // useEffect to fetch employees when page or sorting changes
  useEffect(() => {
    if (currentPage >= 0 && pageSize > 0) {
      fetchEmployees(currentPage, pageSize, table.getState().sorting);
    }
  }, [currentPage, pageSize, table.getState().sorting]);



  
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