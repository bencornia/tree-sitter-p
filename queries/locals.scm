; Scopes

[
  (impl_machine_declaration)
  (spec_machine_declaration)
  (scenario_machine_declaration)
  (p_function_declaration)
  (foreign_function_declaration)
  (pure_declaration)
  (anon_event_handler)
  (no_param_anon_event_handler)
  (quant_expression)
] @local.scope

; Definitions

; Parameters of functions, handlers like `entry (x: int)`, and quantifiers.
(function_param name: (identifier) @local.definition.variable.parameter)

; A machine's variables, which its functions and handlers use.
(machine_entry
  (var_declaration
    (identifier_list names: (identifier) @local.definition.variable.other.member)))

; Variables local to a function or handler.
(function_body
  (var_declaration
    (identifier_list names: (identifier) @local.definition.variable)))

; References

(identifier) @local.reference

; Field names can't refer to locals.
(named_tuple_access_expression field: (identifier) @variable.other.member)
(named_tuple_lvalue (identifier) @variable.other.member)
(named_tuple_body (identifier) @variable.other.member)
(identifier_type name: (identifier) @variable.other.member)
