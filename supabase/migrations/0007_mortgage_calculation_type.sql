-- Add 'mortgage' to the calculation_type check constraint on saved_calculations.
-- The original constraint (from 0006) only allowed 'take_home' and 'loan'.

alter table public.saved_calculations
  drop constraint if exists saved_calculations_calculation_type_check;

alter table public.saved_calculations
  add constraint saved_calculations_calculation_type_check
    check (calculation_type in ('take_home', 'loan', 'mortgage'));
