; Blocks and bracketed lists indent their contents.
[
  (machine_body)
  (state_declaration)
  (function_body)
  (compound_statement)
  (receive_statement)
  (enum_type_declaration)
  (event_set_declaration)
  (invariant_group_declaration)
  (proof_block_declaration)
  (primitve_module_expression)
  (function_param_list)
  (identifier_type_list)
  (rvalue_list)
  (named_tuple_body)
  (unnamed_tuple_body)
] @indent

; A statement or declaration continued on the next line is indented, as in
;   assert x in s,
;     format("{0} is missing", x);
[
  (assert_statement)
  (assign_statement)
  (send_statement)
  (return_statement)
  (announce_statement)
  (raise_statement)
  (safety_test_declaration)
  (refinement_test_declaration)
  (implementation_declaration)
] @indent

[
  "}"
  ")"
  "]"
] @outdent

; The statement after an `if`, `else`, `while` or `foreach` without braces.
(if_statement
  then_branch: (_) @indent
  (#not-kind-eq? @indent "compound_statement")
  (#set! "scope" "all"))
(if_statement
  else_branch: (_) @indent
  (#not-kind-eq? @indent "compound_statement")
  (#not-kind-eq? @indent "if_statement")
  (#set! "scope" "all"))
(while_statement
  (_) @indent .
  (#not-kind-eq? @indent "compound_statement")
  (#set! "scope" "all"))
(foreach_statement
  (_) @indent .
  (#not-kind-eq? @indent "compound_statement")
  (#set! "scope" "all"))
