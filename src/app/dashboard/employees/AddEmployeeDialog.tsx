'use client';
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Employee, FormErrors } from "@/types";
import { Loader } from 'react-feather';
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const AddEmployeeDialog = ({
    isOpen, 
  setIsOpen, 
  onAddEmployee, 
  onUpdateEmployee, 
  employee,
  type
  }: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAddEmployee: (newEmployee: Employee) => Promise<boolean>;
    onUpdateEmployee: (updatedEmployee: Employee) => Promise<boolean>;
    employee: Employee | null;
    type: string;
  }) => {

    const [name, setName] = useState(employee?.name || "");
    const [address, setAddress] = useState(employee?.address || "");
    const [contact, setContact] = useState(employee?.contact || "");
    const [age, setAge] = useState(employee?.age || "");
    const [gender, setGender] = useState(employee?.gender || "Male");
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [errors, setErrors] = useState<FormErrors>({});


  useEffect(() => {

    if (employee && type=== 'edit') {
        setName(employee?.name || "")
        setAddress(employee?.address || "");
        setContact(employee?.contact || "");
        setAge(employee?.age || "");
        setGender(employee?.gender || "Male"); // You can choose a fallback for gender as well
    }else{
        setName('');
        setAddress('');
        setContact('');
        setAge('');
        setGender('Male');
    }
  }, [employee,type]);

    const handleDialogChange = (open: boolean) => {

        if(type === 'add'){
            setName('');
            setAddress('');
            setContact('');
            setAge('');
            setGender('Male');
        }else{
            setName(employee?.name || "")
            setAddress(employee?.address || "");
            setContact(employee?.contact || "");
            setAge(employee?.age || "");
            setGender(employee?.gender || "Male"); // You can choose a fallback for gender as well
        }
      if (!open) {
        setErrors({});
      }
      setIsOpen(open);
    };

  
    const validateForm = () => {
      const newErrors: FormErrors = {};
      const phoneRegex = /^[0-9]{11}$/;

      if (!name) newErrors.name = 'Name is required';
      if (!address) newErrors.address = 'Address is required';
      if (!contact) newErrors.contact = 'Contact is required';
      else  if (!phoneRegex.test(contact)) {
        newErrors.contact = "Contact number must be 10 digits and contain only numbers";
       }
      if (!age) newErrors.age = 'Age is required';
      else  if (!Number.isInteger(parseInt(age))) {
        newErrors.age = "Age must be a valid integer";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const addEmployee = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      if (validateForm()) {
        const newEmployee: Employee = {
            name, address, contact, age, gender
        };
        const isSuccess = await onAddEmployee(newEmployee);
        if (isSuccess) {
          handleDialogChange(false);
        }
      }
      setIsLoading(false);
    };
  
    const updateEmployee = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
    
      if (validateForm()) {
        const updatedEmployee: Employee = { name, address, contact, age, gender, id: employee!.id };
  
        const isSuccess = await onUpdateEmployee(updatedEmployee);
        if (isSuccess) {
          handleDialogChange(false);
        }
      }
      setIsLoading(false);
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={handleDialogChange} >
        <DialogOverlay 
            className="fixed inset-0 bg-black bg-opacity-10"
            onClick={(e) => e.stopPropagation()} // Prevent click outside from closing the dialog
        />
        <DialogContent  
        onEscapeKeyDown={(e) => e.preventDefault()}
	    onInteractOutside={(e) => e.preventDefault()} >
        <DialogDescription></DialogDescription>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
  
          <form onSubmit={employee ? updateEmployee : addEmployee}>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border rounded my-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full p-3 border rounded  my-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
            <Input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`w-full p-3 border rounded  my-2 ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
            )}
            <Input
              type="number"
              name="age"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`w-full p-3 border rounded  my-2 ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger   className={`w-full p-3 border rounded  my-2 ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}>
                {gender || "Select Gender"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-custom-green hover:bg-green-900 rounded flex items-center justify-center"
            >
              {isLoading ? (
                <Loader className="animate-spin mr-2" size={20} />
              ) : (
                employee ? 'Update Employee' : 'Add Employee'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default AddEmployeeDialog;
  
