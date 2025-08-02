-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add the orders table to the realtime publication
ALTER publication supabase_realtime ADD TABLE public.orders;