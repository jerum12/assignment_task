'use client';
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FormErrors } from "@/types";
import { Loader } from 'react-feather';

const AddTaskDialog = ({ onAddTask }: { onAddTask: (title: string, description: string) =>  Promise<boolean> }) => {
    const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isOpen, setIsOpen] = useState(false); // Track dialog open state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const validateForm = () => {
    const newErrors: any = {};
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    if (validateForm()) {
        const isSuccess = await onAddTask(title, description); // Wait for parent function

      if(isSuccess) {
        setTitle(''); // Clear input only on success
        setDescription('');
        setIsOpen(false); // Close dialog
      }
      //handleDialogChange(false);
    }
    setIsLoading(false);
  };

  // Reset errors when dialog is closed
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset errors when dialog is closed
      setErrors({});
      setTitle('');
      setDescription('');
    }
    setIsOpen(open); // Update the dialog open state
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
   <DialogOverlay className="fixed inset-0 bg-black bg-opacity-10" />
      <DialogTrigger>
        <div
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
          onClick={() => setIsOpen(true)} // Open dialog when clicked
        >
          Add Task
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Add Task</DialogTitle>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            disabled={isLoading} 
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border rounded ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}

          <Textarea
            placeholder="Description"
            value={description}
            disabled={isLoading} 
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-3 border rounded ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}

        <Button
            className="px-4 py-2 bg-custom-green rounded flex items-center justify-center"
            onClick={addTask}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
                <>
                    <Loader className="animate-spin mr-2" size={20} />
                </>
            ) : (
              'Save Task'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
