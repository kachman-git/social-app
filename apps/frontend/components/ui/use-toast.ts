import { useToast as useToastOriginal } from "@/components/ui/toast"

export function useToast() {
  const { toast } = useToastOriginal()
  return { toast }
}

