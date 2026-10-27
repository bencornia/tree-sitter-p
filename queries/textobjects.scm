; Functions, and event handlers, whose bodies are functions too.
[
  (p_function_declaration (function_body) @function.inside)
  (pure_declaration)
  (foreign_function_declaration)
] @function.around

; The whole `entry`, `on ... do`, `on ... goto ... with` or `case` around an
; event handler.
(_
  [
    (anon_event_handler (function_body) @function.inside)
    (no_param_anon_event_handler (function_body) @function.inside)
  ]) @function.around

; Machines.
[
  (impl_machine_declaration (machine_body) @class.inside)
  (spec_machine_declaration (machine_body) @class.inside)
  (scenario_machine_declaration (machine_body) @class.inside)
] @class.around

; Parameters, arguments, and the elements of tuples and tuple types.
(function_param_list
  ((_) @parameter.inside . ","? @parameter.around) @parameter.around)
(rvalue_list
  ((_) @parameter.inside . ","? @parameter.around) @parameter.around)
; The target and event of `send`, and the event of `raise` and `announce`;
; any payload after them is an rvalue_list.
(send_statement
  . (_) @parameter.inside @parameter.around
  . "," @parameter.around)
(send_statement
  (_) . "," . (_) @parameter.inside @parameter.around
  . ","? @parameter.around)
(raise_statement
  . (_) @parameter.inside @parameter.around
  . ","? @parameter.around)
(announce_statement
  . (_) @parameter.inside @parameter.around
  . ","? @parameter.around)
(unnamed_tuple_body
  ((_) @parameter.inside . ","? @parameter.around) @parameter.around)
(named_tuple_body
  ((identifier) @parameter.inside . "=" @parameter.inside . (_) @parameter.inside . ","? @parameter.around) @parameter.around)
(identifier_type_list
  ((_) @parameter.inside . ","? @parameter.around) @parameter.around)
(tuple_type
  ((_) @parameter.inside . ","? @parameter.around) @parameter.around)

(comment) @comment.inside
(comment)+ @comment.around

[
  (safety_test_declaration)
  (refinement_test_declaration)
] @test.around
