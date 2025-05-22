"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Attribute, AttributeType } from "@prisma/client";
import { ServerErrorCode } from "@/enums/common";
import { toast } from "sonner";
import { updateAttributeAction } from "@/server-actions/attributes/updateAttributeAction";
import { editAttributeSchema } from "@/schemas/attribute/editAttribute";
import { EditAttributeSchema } from "@/schemas/attribute/editAttribute";
import { EditAttributeFormItems } from "./EditAttributeFormItems";

interface EditAttributeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialAttribute: Attribute;
  onEditSuccess?: (attribute: Attribute) => void;
}

export function EditAttributeModal({
  open,
  setOpen,
  initialAttribute,
  onEditSuccess,
}: EditAttributeModalProps) {
  const form = useForm<EditAttributeSchema>({
    resolver: zodResolver(editAttributeSchema),
    values: {
      ...initialAttribute,
      name: initialAttribute?.name || "",
      type: initialAttribute?.type || AttributeType.SHORT_TEXT,
      description: initialAttribute?.description || undefined,
      enrichmentInstructions:
        initialAttribute?.enrichmentInstructions || undefined,
      required: initialAttribute?.required || false,
      enrichmentEnabled: initialAttribute?.enrichmentEnabled || false,
      selectOptions: initialAttribute?.selectOptions || [],
      measureUnits: initialAttribute?.measureUnits || [],
      primaryMedia: initialAttribute?.primaryMedia || false,
    },
  });

  const handleEditAttribute = async (input: EditAttributeSchema) => {
    if (!initialAttribute) {
      return;
    }
    try {
      const response = await updateAttributeAction(initialAttribute.id, input);
      if (response.data && response.errorCode === ServerErrorCode.SUCCESS) {
        onEditSuccess?.(response.data);
        toast.success(`${input.name} updated successfully`);
        setOpen(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    form.reset();
    if (!open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-y-auto max-h-[90vh]">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleEditAttribute)}>
            <DialogHeader>
              <DialogTitle>
                Edit Attribute &quot;{initialAttribute?.name}&quot;
              </DialogTitle>
              <DialogDescription>Edit the attribute</DialogDescription>
            </DialogHeader>
            <EditAttributeFormItems />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                isLoading={form.formState.isSubmitting}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
