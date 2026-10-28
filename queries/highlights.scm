; Names are variables unless a more specific pattern below says otherwise.
; Later patterns take precedence.
(identifier) @variable

; types
; - builtin
; - parameter
; - enum
[
	"bool"
    "int"
    "float"
    "string"
    "event"
    "machine"
    "data"
    "map"
    "seq"
    "set"
    "spec"
    "scenario"
    "halt"
    "any"
    "module"
    "$"
    "$$"
] @type.builtin

"enum" @type.enum
(enum_type_declaration name: (identifier) @type)
(enum_elem name: (identifier) @constant)

(named_type) @type
(impl_machine_declaration name: (identifier) @type)
(state_declaration name: (identifier) @type)
(p_function_declaration name: (identifier) @type)
(state_name state: (identifier) @type)

[
	"true"
    "false"
    (null_literal)
] @constant.builtin

[
	(int_literal)
    (float_literal)
] @constant.numeric

; string
(string_literal) @string

(comment) @comment

; variable
; - builtin
; - parameter
; - other.member (tuples?)

(ctor_expression interface_name: (identifier) @constructor)
(ctor_statement (identifier) @constructor)
(identifier_type name: (identifier) @variable.other.member)
(named_tuple_body (identifier) @variable.other.member)
(named_tuple_access_expression (identifier) @variable)
(named_tuple_access_expression field: (identifier) @variable.other.member)
; Declarations look like their uses, which locals.scm colors.
(function_param name: (identifier) @variable.parameter)
(machine_entry
  (var_declaration
    (identifier_list names: (identifier) @variable.other.member)))

("this" @variable.builtin)

[
	"."
    ","
    ":"
    ";"
] @punctuation.delimiter

[
    "("
    ")"
    "["
    "]"
    "{"
    "}"
] @punctuation.bracket

; keyword
; - control
;   - conditional
;   - repeat
;   - return
;   - exception???
;   - operator or,in, etc
; - function: fun

[
	"main"
	"test"
    "assume"
    "wise"
	"param"
	"type"
    "start"
    "state"
    "hot"
    "cold"
	"assert"
    "entry"
    "send"
    "defer"
    "var"
    "union"
    "goto"
    "on"
    "print"
    "do"
    "new"
    "with"
    "observes"
    "announce"
    "raise"
    "ignore"
    "as"
    "exit"
    "sends"
    "receives"
    "creates"
    "compose"
    "implementation"
    "refines"
    "rename"
    "to"
    "hidee"
    "hidei"
    "using"
    "is"
    "pure"
    "requires"
    "ensures"
    "invariant"
    "axiom"
    "init-condition"
    "inflight"
    "sent"
    "targets"
    "except"
    "pairwise"
    "prove"
    "Lemma"
    "Theorem"
    "Proof"
] @keyword

[
	"in"
    "forall"
    "exists"
] @keyword.operator

(if_statement ["if" "else"] @keyword.conditional)
(receive_statement "receive" @keyword.conditional)
(recv_case "case" @keyword.conditional)
(while_statement "while" @keyword.repeat)
(foreach_statement "foreach" @keyword.repeat)
[
    "break"
    "continue"
] @keyword.repeat
"return" @keyword.return

"fun" @keyword.function

; operator
[
    "!"
    "&&"
    "||"
    "==>"
    "<==>"
    "=="
    "!="
    "<="
    ">="
    "<"
    ">"
    "->"
    "="
    "+="
    "-="
    "+"
    "-"
    "*"
    "/"
    "%"
] @operator

; function
; - builtin
; - method? maybe like state function declarations?
[
	"default"
	"sizeof"
	"keys"
    "values"
	"choose"
	"print"
    "format"
] @function.builtin
