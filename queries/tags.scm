; Definitions

(
  (comment)* @doc
  .
  [
    (impl_machine_declaration name: (identifier) @name)
    (spec_machine_declaration name: (identifier) @name)
    (scenario_machine_declaration name: (identifier) @name)
  ] @definition.class
  (#strip! @doc "^//\\s*")
  (#set-adjacent! @doc @definition.class)
)

; Top-level functions. (A doc comment pattern like the one above can't be
; anchored inside `program`, so these go without.)
(program
  (function_declaration
    [
      (p_function_declaration name: (identifier) @name)
      (foreign_function_declaration name: (identifier) @name)
    ]) @definition.function)

; A machine's functions.
(machine_entry
  (function_declaration
    [
      (p_function_declaration name: (identifier) @name)
      (foreign_function_declaration name: (identifier) @name)
    ]) @definition.method)

(pure_declaration name: (identifier) @name) @definition.function

(interface_declaration name: (identifier) @name) @definition.interface

[
  (p_type_def name: (identifier) @name)
  (foreign_type_def name: (identifier) @name)
  (enum_type_declaration name: (identifier) @name)
] @definition.type

[
  (event_declaration name: (identifier) @name)
  (event_set_declaration name: (identifier) @name)
  (enum_elem name: (identifier) @name)
  (numbered_enum_elem name: (identifier) @name)
  (invariant_declaration name: (identifier) @name)
] @definition.constant

; States, modules, tests and proofs.
[
  (state_declaration name: (identifier) @name)
  (named_module_declaration name: (identifier) @name)
  (safety_test_declaration test_name: (identifier) @name)
  (refinement_test_declaration test_name: (identifier) @name)
  (implementation_declaration impl_name: (identifier) @name)
] @definition.module

; References

(function_call_expression fun: (identifier) @name) @reference.call
(function_call_statement . (identifier) @name) @reference.call

(ctor_expression interface_name: (identifier) @name) @reference.class
(ctor_statement . (identifier) @name) @reference.class

(named_type name: (identifier) @name) @reference.type
