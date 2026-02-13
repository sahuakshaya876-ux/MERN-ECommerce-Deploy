
import { filterOptions } from "@/config";
import { Label } from "@radix-ui/react-label";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>

      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>

              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => {
                  const optionValue = option.id.toLowerCase(); // ✅ FIX

                  return (
                    <Label
                      key={option.id}
                      className="flex font-normal items-center gap-2"
                    >
                      <Checkbox
                        className="peer data-[state=checked]:bg-brandPink/30 data-[state=checked]:border-brandPink/40 data-[state=checked]:text-white"
                        checked={filters?.[keyItem]?.includes(optionValue) ?? false}
                        onCheckedChange={() => handleFilter(keyItem, optionValue)}
                      />
                      <span className="peer-checked:text-brandPink peer-checked:font-medium">{option.label}</span>
                    </Label>
                  );
                })}
              </div>
            </div>

            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
