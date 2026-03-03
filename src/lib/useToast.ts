import { toast } from 'sonner';

export const useToast = () => {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    info: (message: string) => toast.info(message),
    promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }) => 
      toast.promise(promise, messages),
  };
};
