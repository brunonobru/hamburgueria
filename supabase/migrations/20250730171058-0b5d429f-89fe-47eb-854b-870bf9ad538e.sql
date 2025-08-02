-- Add customization field to order_items table to store removed ingredients
ALTER TABLE public.order_items 
ADD COLUMN removed_ingredients text[];

-- Add comment to document the field purpose
COMMENT ON COLUMN public.order_items.removed_ingredients IS 'Array of ingredient names that were removed from the product customization';