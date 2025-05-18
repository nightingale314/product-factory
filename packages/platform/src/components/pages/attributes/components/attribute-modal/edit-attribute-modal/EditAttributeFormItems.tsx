"use client";

import { FormField } from "@/components/composition/form/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CreateAttributeSchema } from "@/schemas/attribute/createAttribute";
import { AttributeType } from "@prisma/client";
import { Controller, useFormContext } from "react-hook-form";
import { SelectAttributeConfig } from "../common/SelectAttributeConfig";

const attributeTypes = [
  { label: "Short text", value: AttributeType.SHORT_TEXT },
  { label: "Long text", value: AttributeType.LONG_TEXT },
  { label: "Number", value: AttributeType.NUMBER },
  { label: "Boolean", value: AttributeType.BOOLEAN },
  { label: "Date", value: AttributeType.DATE },
  { label: "Single select", value: AttributeType.SINGLE_SELECT },
  { label: "Multi select", value: AttributeType.MULTI_SELECT },
  { label: "HTML", value: AttributeType.HTML },
  { label: "Media", value: AttributeType.MEDIA },
  { label: "Measure", value: AttributeType.MEASURE },
];

export function EditAttributeFormItems() {
  const {
    control,
    register,
    formState: { errors, defaultValues },
  } = useFormContext<CreateAttributeSchema>();

  const attributeType = defaultValues?.type;

  return (
    <div className="grid grid-cols-2 gap-8 py-4">
      <FormField
        errors={errors}
        name="name"
        label="Name"
        required
        description="Name of the attribute."
      >
        <Input {...register("name")} defaultValue={defaultValues?.name} />
      </FormField>

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormField
            name="type"
            label="Type"
            errors={errors}
            description="Type of the attribute."
          >
            <Select
              defaultValue={defaultValues?.type}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              disabled
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an attribute type" />
              </SelectTrigger>
              <SelectContent>
                {attributeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
      />

      <FormField
        errors={errors}
        name="description"
        label="Description"
        description="Description of the attribute."
        className="col-span-2"
      >
        <Textarea
          {...register("description")}
          className="resize-none h-24"
          placeholder="E.g. The brand or manufacturer that produces this product. Used to identify the company responsible for creating or selling the item."
        />
      </FormField>

      {(attributeType === AttributeType.SINGLE_SELECT ||
        attributeType === AttributeType.MULTI_SELECT) && (
        <FormField
          name="selectOptions"
          errors={errors}
          label="Attribute Select Type Options"
          className="col-span-2"
          description="Enter the options for the select attribute. Each option should be unique and on a new line."
        >
          <SelectAttributeConfig
            initialOptions={
              defaultValues?.selectOptions as string[] | undefined
            }
            appendMode
          />
        </FormField>
      )}

      {attributeType === AttributeType.MEASURE && (
        <Controller
          name="measureUnits"
          control={control}
          render={({ field }) => (
            <FormField
              name="measureUnits"
              errors={errors}
              label="Attribute Measure Units"
              className="col-span-2"
              description="Enter the units for the measure attribute. Each unit should be unique and on a new line."
            >
              <SelectAttributeConfig
                initialOptions={field?.value}
                onChange={(options) => {
                  field.onChange(options);
                }}
                appendMode
              />
            </FormField>
          )}
        />
      )}

      <Controller
        name="required"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormField
            name="required"
            label="Required"
            errors={errors}
            vertical={false}
            description="If enabled, this attribute will be required in applicable products."
          >
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormField>
        )}
      />

      <Controller
        name="enrichmentEnabled"
        control={control}
        rules={{ required: true }}
        disabled={attributeType === AttributeType.MEDIA}
        render={({ field }) => (
          <FormField
            name="enrichmentEnabled"
            label="Enable Enrichment"
            errors={errors}
            vertical={false}
            description="Attribute will be enriched during enrichment process."
          >
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormField>
        )}
      />

      <FormField
        errors={errors}
        name="enrichmentInstructions"
        label="Enrichment Instructions"
        description="Additional instructions on this attribute during enrichment process. If omitted, this attribute's semantic meaning will be inferred from it's description."
        className="col-span-2"
      >
        <Textarea
          {...register("enrichmentInstructions")}
          className="resize-none h-24"
          placeholder="E.g. Has a special format of {value} and {unit}."
        />
      </FormField>
    </div>
  );
}
