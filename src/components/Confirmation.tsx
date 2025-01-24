import { Loader } from "react-feather";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";

const ConfirmationModal: React.FC<{
    open: boolean;
    isLoading: boolean;
    setShowModal: () => void;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }> = ({ open, setShowModal, isLoading, title, description, onConfirm, onCancel }) => (
    <Dialog open={open} onOpenChange={setShowModal}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-10" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96 ">
        <DialogTitle></DialogTitle>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex justify-end space-x-4">
          <Button onClick={onCancel} variant="secondary" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className='bg-custom-green' variant="default" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader className="animate-spin mr-2" size={20} />
                </>
            ) : (
                'Confirm'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  export default ConfirmationModal