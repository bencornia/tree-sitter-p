/**
 * @file P Programming Language Tree Sitter Parser
 * @author Ben Cornia <ben.cornia@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// see: https://github.com/p-org/P/blob/master/Src/PCompiler/CompilerCore/Parser/PParser.g4
export default grammar({
    name: 'p',

    // TODO: potentially add conflicts???

    word: ($) => $.identifier,

    supertypes: ($) => [
        $.type,
        $.expression,
        $.top_declaration,
        $.statement,
        $.module_expression,
        $.primitive_expression,
        $.primitive_type,
    ],

    extras: ($) => [/\s/, $.comment],

    reserved: {
        global: ($) => [
            'announce',
            'as',
            'assert',
            'assume',
            'axiom',
            'break',
            'case',
            'choose',
            'cold',
            'compose',
            'continue',
            'creates',
            'default',
            'defer',
            'do',
            'else',
            'ensures',
            'entry',
            'except',
            'exists',
            'exit',
            'forall',
            'foreach',
            'format',
            'fun',
            'goto',
            'halt',
            'hidee',
            'hidei',
            'hot',
            'if',
            'ignore',
            'implementation',
            'in',
            'inflight',
            'init-condition',
            'invariant',
            'is',
            'keys',
            'Lemma',
            'main',
            'module',
            'new',
            'observes',
            'on',
            'pairwise',
            'param',
            // 'paramtest',
            'print',
            'Proof',
            'prove',
            'pure',
            'raise',
            'receive',
            'receives',
            'refines',
            'rename',
            'requires',
            'return',
            // 'safe',
            'scenario',
            'send',
            'sends',
            'sent',
            'sizeof',
            'spec',
            'start',
            'state',
            'targets',
            'test',
            'Theorem',
            'this',
            'to',
            'type',
            'union',
            'using',
            'values',
            'var',
            'while',
            'wise',
            'with',
        ],
    },

    rules: {
        program: ($) => repeat($.top_declaration),

        // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
        comment: (_) =>
            token(
                choice(
                    seq('//', /.*/),
                    seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
                ),
            ),

        identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

        int_literal: ($) => /[0-9][0-9]*/,

        // Types
        type: ($) =>
            choice(
                $.sequence_type,
                $.set_type,
                $.map_type,
                $.tuple_type,
                $.named_tuple_type,
                $.primitive_type,
                $.named_type,
            ),

        sequence_type: ($) => seq('seq', '[', $.type, ']'),

        set_type: ($) => seq('set', '[', $.type, ']'),

        map_type: ($) =>
            seq(
                'map',
                '[',
                field('key_type', $.type),
                ',',
                field('value_type', $.type),
                ']',
            ),

        tuple_type: ($) =>
            seq(
                '(',
                field('tup_types', $.type),
                repeat(seq(',', field('tup_types', $.type))),
                ')',
            ),

        named_tuple_type: ($) => seq('(', $.identifier_type_list, ')'),

        primitive_type: ($) =>
            choice(
                'bool',
                'int',
                'float',
                'string',
                'event',
                'machine',
                'data',
                'any',
            ),

        named_type: ($) => field('name', $.identifier),

        identifier_type_list: ($) =>
            seq($.identifier_type, repeat(seq(',', $.identifier_type))),
        identifier_type: ($) => seq(field('name', $.identifier), ':', $.type),

        function_param_list: ($) =>
            seq($.function_param, repeat(seq(',', $.function_param))),
        function_param: ($) => seq(field('name', $.identifier), ':', $.type),

        // Declarations
        top_declaration: ($) =>
            choice(
                $.type_def_declaration,
                $.enum_type_declaration,
                $.event_declaration,
                $.event_set_declaration,
                $.interface_declaration,
                $.impl_machine_declaration,
                $.spec_machine_declaration,
                $.scenario_machine_declaration,
                $.function_declaration,
                $.pure_declaration,
                $.named_module_declaration,
                $.test_declaration,
                $.implementation_declaration,
                $.global_param_declaration,
                $.invariant_declaration,
                $.invariant_group_declaration,
                $.axiom_declaration,
                $.assume_on_start_declaration,
                $.proof_block_declaration,
            ),

        type_def_declaration: ($) => choice($.foreign_type_def, $.p_type_def),

        foreign_type_def: ($) =>
            seq('type', field('name', $.identifier), ';'),

        p_type_def: ($) =>
            seq('type', field('name', $.identifier), '=', $.type, ';'),

        enum_type_declaration: ($) =>
            choice(
                seq(
                    'enum',
                    field('name', $.identifier),
                    '{',
                    $.enum_elem_list,
                    '}',
                ),
                seq(
                    'enum',
                    field('name', $.identifier),
                    '{',
                    $.numbered_enum_elem_list,
                    '}',
                ),
            ),

        enum_elem_list: ($) => seq($.enum_elem, repeat(seq(',', $.enum_elem))),

        enum_elem: ($) => field('name', $.identifier),

        numbered_enum_elem_list: ($) =>
            seq($.numbered_enum_elem, repeat(seq(',', $.numbered_enum_elem))),

        numbered_enum_elem: ($) =>
            seq(
                field('name', $.identifier),
                '=',
                field('value', $.int_literal),
            ),

        event_declaration: ($) =>
            seq(
                'event',
                field('name', $.identifier),
                optional(seq(':', $.type)),
                ';',
            ),

        event_set_declaration: ($) =>
            seq(
                'eventset',
                field('name', $.identifier),
                '=',
                '{',
                $.event_set_literal,
                '}',
                ';',
            ),

        event_set_literal: ($) =>
            seq(
                field('events', $.non_default_event),
                repeat(seq(',', field('events', $.non_default_event))),
            ),

        non_default_event_list: ($) =>
            seq(
                field('events', $.non_default_event),
                repeat(seq(',', field('events', $.non_default_event))),
            ),

        non_default_event: ($) => choice('halt', $.identifier),

        interface_declaration: ($) =>
            seq(
                'interface',
                field('name', $.identifier),
                '(',
                optional($.type),
                ')',
                'receives',
                optional($.non_default_event_list),
                ';',
            ),

        spec_machine_declaration: ($) =>
            seq(
                'spec',
                field('name', $.identifier),
                'observes',
                $.event_set_literal,
                $.machine_body,
            ),

        scenario_machine_declaration: ($) =>
            seq(
                'scenario',
                field('name', $.identifier),
                'observes',
                $.event_set_literal,
                $.machine_body,
            ),

        function_declaration: ($) =>
            choice($.foreign_function_declaration, $.p_function_declaration),

        foreign_function_declaration: ($) =>
            choice(
                seq(
                    'fun',
                    field('name', $.identifier),
                    '(',
                    optional($.function_param_list),
                    ')',
                    optional(seq(':', $.type)),
                    optional(seq('creates', field('interfaces', $.identifier))),
                    ';',
                ),
                seq(
                    'fun',
                    field('name', $.identifier),
                    '(',
                    optional($.function_param_list),
                    ')',
                    optional(seq('return', '(', $.function_param, ')', ';')),
                    repeat(
                        seq('requires', field('requires', $.expression), ';'),
                    ),
                    repeat(seq('ensures', field('ensures', $.expression), ';')),
                ),
            ),

        p_function_declaration: ($) =>
            seq(
                'fun',
                field('name', $.identifier),
                '(',
                optional($.function_param_list),
                ')',
                optional(seq(':', $.type)),
                $.function_body,
            ),

        pure_declaration: ($) =>
            seq(
                'pure',
                field('name', $.identifier),
                '(',
                optional($.function_param_list),
                ')',
                ':',
                $.type,
                optional(seq('=', field('body', $.expression))),
                ';',
            ),

        test_declaration: ($) =>
            choice($.safety_test_declaration, $.refinement_test_declaration),

        safety_test_declaration: ($) =>
            seq(
                'test',
                optional(seq('param', field('global_param', $.param))),
                optional(
                    seq('assume', field('assume_expression', $.expression)),
                ),
                optional($.twise),
                field('test_name', $.identifier),
                '[',
                'main',
                '=',
                field('main_machine', $.identifier), // TODO: is there an optional here?
                ']',
                ':',
                $.module_expression,
                ';',
            ),

        refinement_test_declaration: ($) =>
            seq(
                'test',
                field('test_name', $.identifier),
                '[',
                'main',
                '=',
                field('main_machine', $.identifier),
                ']',
                ':',
                $.module_expression,
                'refines',
                $.module_expression,
                ';',
            ),

        twise: ($) => choice('pairwise', seq('(', $.int_literal, 'wise', ')')),

        implementation_declaration: ($) =>
            seq(
                'implementation',
                field('impl_name', $.identifier),
                optional(
                    seq(
                        '[',
                        'main',
                        '=',
                        field('main_machine', $.identifier),
                        ']',
                    ),
                ),
                ':',
                $.module_expression,
                ';',
            ),

        global_param_declaration: ($) =>
            seq('param', $.identifier_list, ':', $.type, ';'),

        invariant_declaration: ($) =>
            seq(
                'invariant',
                field('name', $.identifier),
                ':',
                $.expression,
                ';',
            ),
        invariant_group_declaration: ($) =>
            choice(
                seq(
                    'Lemma',
                    field('name', $.identifier),
                    '{',
                    repeat($.invariant_declaration),
                    '}',
                ),
                seq(
                    'Theorem',
                    field('name', $.identifier),
                    '{',
                    repeat($.invariant_declaration),
                    '}',
                ),
            ),

        axiom_declaration: ($) =>
            seq('axiom', field('body', $.expression), ';'),

        assume_on_start_declaration: ($) =>
            seq('init-condition', field('body', $.expression), ';'),

        proof_block_declaration: ($) =>
            seq(
                'Proof',
                optional(field('name', $.identifier)),
                '{',
                optional($.proof_body),
                '}',
            ),

        proof_body: ($) => repeat1($.proof_item),

        proof_item: ($) =>
            seq(
                'prove',
                choice(
                    seq(
                        field('targets', $.expression),
                        repeat(seq(',', field('targets', $.expression))),
                    ),
                    field('goals_all', '*'),
                    field('goals_default', 'default'),
                ),
                optional(
                    seq(
                        'using',
                        choice(
                            seq(
                                field('premises', $.expression),
                                repeat(
                                    seq(',', field('premises', $.expression)),
                                ),
                            ),
                            field('premises_all', '*'),
                        ),
                    ),
                ),
                optional(
                    seq(
                        'except',
                        field('excludes', $.expression),
                        repeat(seq(',', field('excludes', $.expression))),
                    ),
                ),
                ';',
            ),

        impl_machine_declaration: ($) =>
            seq(
                'machine',
                field('name', $.identifier),
                repeat($.receives_sends),
                $.machine_body,
            ),

        identifier_list: ($) =>
            seq(
                field('names', $.identifier),
                repeat(seq(',', field('names', $.identifier))),
            ),

        receives_sends: ($) => choice($.machine_receive, $.machine_send),

        machine_receive: ($) =>
            seq('receives', optional($.event_set_literal), ';'),

        machine_send: ($) => seq('sends', optional($.event_set_literal), ';'),

        machine_body: ($) => seq('{', repeat($.machine_entry), '}'),

        machine_entry: ($) =>
            choice(
                $.var_declaration,
                $.function_declaration,
                $.state_declaration,
            ),

        var_declaration: ($) => seq('var', $.identifier_list, ':', $.type, ';'),

        state_declaration: ($) =>
            seq(
                optional('start'),
                optional(field('temperature', choice('hot', 'cold'))),
                'state',
                field('name', $.identifier),
                '{',
                repeat($._state_body_item),
                '}',
            ),

        _state_body_item: ($) =>
            choice(
                $.state_entry_anon,
                $.state_entry_fun,
                $.state_exit_anon,
                $.state_exit_fun,
                $.state_defer,
                $.state_ignore,
                $.on_event_do_action_with_fun,
                $.on_event_do_action_with_anon,
                $.on_event_goto_state,
                $.on_event_goto_state_with_anon,
                $.on_event_goto_state_with_fun,
            ),

        state_entry_anon: ($) => seq('entry', $.anon_event_handler),

        state_entry_fun: ($) =>
            seq('entry', field('function_name', $.identifier), ';'),

        state_exit_anon: ($) => seq('exit', $.no_param_anon_event_handler),

        state_exit_fun: ($) =>
            seq('exit', field('function_name', $.identifier), ';'),

        state_defer: ($) => seq('defer', $.non_default_event_list, ';'),

        state_ignore: ($) => seq('ignore', $.non_default_event_list, ';'),

        on_event_do_action_with_fun: ($) =>
            seq(
                'on',
                $.event_list,
                'do',
                field('function_name', $.identifier),
                ';',
            ),

        on_event_do_action_with_anon: ($) =>
            seq('on', $.event_list, 'do', $.anon_event_handler),

        on_event_goto_state: ($) =>
            seq('on', $.event_list, 'goto', $.state_name, ';'),

        on_event_goto_state_with_anon: ($) =>
            seq(
                'on',
                $.event_list,
                'goto',
                $.state_name,
                'with',
                $.anon_event_handler,
            ),

        on_event_goto_state_with_fun: ($) =>
            seq(
                'on',
                $.event_list,
                'goto',
                $.state_name,
                'with',
                field('function_name', $.identifier),
                ';',
            ),

        event_list: ($) => seq($.event_id, repeat(seq(',', $.event_id))),
        event_id: ($) => choice($.null_literal, 'halt', $.identifier),

        state_name: ($) => field('state', $.identifier),

        function_body: ($) =>
            seq('{', repeat($.var_declaration), repeat($.statement), '}'),

        // Statements
        statement: ($) =>
            choice(
                $.compound_statement,
                $.assert_statement,
                $.assume_statement,
                $.print_statement,
                $.return_statement,
                $.break_statement,
                $.continue_statement,
                $.assign_statement,
                $.insert_statement,
                $.add_statement,
                $.remove_statement,
                $.while_statement,
                $.foreach_statement,
                $.if_statement,
                $.ctor_statement,
                $.function_call_statement,
                $.raise_statement,
                $.send_statement,
                $.announce_statement,
                $.goto_statement,
                $.receive_statement,
                $.no_statement,
            ),

        compound_statement: ($) => seq('{', repeat($.statement), '}'),

        assert_statement: ($) =>
            seq(
                'assert',
                field('assertion', $.expression),
                optional(seq(',', field('message', $.expression))),
                ';',
            ),

        assume_statement: ($) =>
            seq(
                'assume',
                field('assumption', $.expression),
                optional(seq(',', field('message', $.expression))),
                ';',
            ),

        print_statement: ($) =>
            seq('print', field('message', $.expression), ';'),

        return_statement: ($) => seq('return', optional($.expression), ';'),

        break_statement: ($) => seq('break', ';'),

        continue_statement: ($) => seq('continue', ';'),

        assign_statement: ($) => seq($.lvalue, '=', $.rvalue, ';'),

        insert_statement: ($) =>
            seq($.lvalue, '+=', '(', $.expression, ',', $.rvalue, ')', ';'),

        add_statement: ($) => seq($.lvalue, '+=', '(', $.rvalue, ')', ';'),

        remove_statement: ($) => seq($.lvalue, '-=', $.expression, ';'),

        while_statement: ($) =>
            seq('while', '(', $.expression, ')', $.statement),

        foreach_statement: ($) =>
            seq(
                'foreach',
                '(',
                field('item', $.identifier),
                'in',
                field('collection', $.expression),
                ')',
                repeat(
                    seq('invariant', field('invariants', $.expression), ';'),
                ),
                $.statement,
            ),

        if_statement: ($) =>
            prec.left(
                0,
                seq(
                    'if',
                    '(',
                    $.expression,
                    ')',
                    field('then_branch', $.statement),
                    optional(seq('else', field('else_branch', $.statement))),
                ),
            ),

        ctor_statement: ($) =>
            seq('new', $.identifier, '(', optional($.rvalue_list), ')', ';'),

        function_call_statement: ($) =>
            seq($.identifier, '(', optional($.rvalue_list), ')', ';'),

        raise_statement: ($) =>
            seq('raise', $.expression, optional(seq(',', $.rvalue_list)), ';'),

        send_statement: ($) =>
            seq(
                'send',
                $.expression,
                ',',
                $.expression,
                optional(seq(',', $.rvalue_list)),
                ';',
            ),

        announce_statement: ($) =>
            seq(
                'announce',
                $.expression,
                optional(seq(',', $.rvalue_list)),
                ';',
            ),

        goto_statement: ($) =>
            seq('goto', $.state_name, optional(seq(',', $.rvalue_list)), ';'),

        // P requires at least one case. Allowing none keeps `receive {}`
        // from being a syntax error while the first case is typed, so
        // editors can indent it; plsp (github.com/bencornia/ptools) reports the
        // missing case.
        receive_statement: ($) =>
            seq('receive', '{', repeat($.recv_case), '}'),

        no_statement: ($) => ';',

        lvalue: ($) =>
            choice(
                $.var_lvalue,
                $.named_tuple_lvalue,
                $.tuple_lvalue,
                $.map_or_sequence_lvalue,
            ),

        var_lvalue: ($) => $.identifier,

        named_tuple_lvalue: ($) => seq($.lvalue, '.', $.identifier),

        tuple_lvalue: ($) => seq($.lvalue, '.', $.int_literal),

        map_or_sequence_lvalue: ($) => seq($.lvalue, '[', $.expression, ']'),

        recv_case: ($) => seq('case', $.event_list, ':', $.anon_event_handler),

        anon_event_handler: ($) =>
            seq(optional(seq('(', $.function_param, ')')), $.function_body),

        no_param_anon_event_handler: ($) => $.function_body,

        // Expressions
        expression: ($) =>
            choice(
                $.primitive_expression,
                $.paren_expression,
                $.unnamed_tuple_expression,
                $.named_tuple_expression,
                $.named_tuple_access_expression,
                $.tuple_access_expression,
                $.test_expression,
                $.targets_expression,
                $.flying_expression,
                $.sent_expression,
                $.seq_access_expression,
                $.keyword_expression,
                $.ctor_expression,
                $.function_call_expression,
                $.unary_expression,
                $.bin_expression,
                $.cast_expression,
                $.quant_expression,
                $.choose_expression,
                $.string_expression,
            ),

        primitive_expression: ($) =>
            choice(
                $.identifier,
                $.float_literal,
                $.bool_literal,
                $.int_literal,
                $.null_literal,
                '$',
                '$$',
                'halt',
                'this',
            ),

        paren_expression: ($) => seq('(', $.expression, ')'),

        unnamed_tuple_expression: ($) => seq('(', $.unnamed_tuple_body, ')'),

        named_tuple_expression: ($) => seq('(', $.named_tuple_body, ')'),

        named_tuple_access_expression: ($) =>
            prec.left(16, seq($.expression, '.', field('field', $.identifier))),

        tuple_access_expression: ($) =>
            prec.left(
                15,
                seq($.expression, '.', field('field', $.int_literal)),
            ),

        test_expression: ($) =>
            prec.left(
                14,
                seq(
                    field('instance', $.expression),
                    'is',
                    field('kind', $.identifier),
                ),
            ),

        targets_expression: ($) =>
            prec.left(
                13,
                seq(
                    field('instance', $.expression),
                    'targets',
                    field('target', $.expression),
                ),
            ),

        flying_expression: ($) =>
            prec.left(12, seq('inflight', field('instance', $.expression))),

        sent_expression: ($) =>
            prec.left(12, seq('sent', field('instance', $.expression))),

        seq_access_expression: ($) =>
            prec.left(
                12,
                seq(
                    field('seq', $.expression),
                    '[',
                    field('index', $.expression),
                    ']',
                ),
            ),

        keyword_expression: ($) =>
            choice(
                seq(field('fun', 'keys'), '(', $.expression, ')'),
                seq(field('fun', 'values'), '(', $.expression, ')'),
                seq(field('fun', 'sizeof'), '(', $.expression, ')'),
                seq(field('fun', 'default'), '(', $.type, ')'),
            ),

        ctor_expression: ($) =>
            seq(
                'new',
                field('interface_name', $.identifier),
                '(',
                optional($.rvalue_list),
                ')',
            ),

        function_call_expression: ($) =>
            prec(
                11,
                seq(
                    field('fun', $.identifier),
                    '(',
                    optional($.rvalue_list),
                    ')',
                ),
            ),

        unary_expression: ($) =>
            prec.left(10, seq(field('op', choice('-', '!')), $.expression)),

        bin_expression: ($) =>
            choice(
                prec.left(
                    9,
                    seq(
                        field('lhs', $.expression),
                        field('op', choice('*', '/', '%')),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    8,
                    seq(
                        field('lhs', $.expression),
                        field('op', choice('+', '-')),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    6,
                    seq(
                        field('lhs', $.expression),
                        field('op', choice('<', '>', '>=', '<=', 'in')),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    5,
                    seq(
                        field('lhs', $.expression),
                        field('op', choice('==', '!=')),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    4,
                    seq(
                        field('lhs', $.expression),
                        field('op', '&&'),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    3,
                    seq(
                        field('lhs', $.expression),
                        field('op', '||'),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    2,
                    seq(
                        field('lhs', $.expression),
                        field('op', '==>'),
                        field('rhs', $.expression),
                    ),
                ),
                prec.left(
                    1,
                    seq(
                        field('lhs', $.expression),
                        field('op', '<==>'),
                        field('rhs', $.expression),
                    ),
                ),
            ),

        cast_expression: ($) =>
            prec.left(
                7,
                seq($.expression, field('cast', choice('as', 'to')), $.type),
            ),

        quant_expression: ($) =>
            seq(
                field('quant', choice('forall', 'exists')),
                field('diff', optional('new')),
                '(',
                field('bound', $.function_param_list),
                ')',
                ':',
                ':',
                field('body', $.expression),
            ),

        choose_expression: ($) =>
            seq('choose', '(', optional($.expression), ')'),

        string_expression: ($) => $.formatted_string,

        null_literal: ($) => 'null',

        bool_literal: ($) => choice('true', 'false'),

        float_literal: ($) => choice($.decimal_float, $.exp_float),

        decimal_float: ($) =>
            prec(2, seq(optional($.int_literal), '.', $.int_literal)),
        exp_float: ($) =>
            seq('float', '(', $.int_literal, ',', $.int_literal, ')'),

        formatted_string: ($) =>
            choice(
                $.string_literal,
                seq(
                    'format',
                    '(',
                    $.string_literal,
                    optional(seq(',', $.rvalue_list)),
                    ')',
                ),
            ),

        string_literal: ($) =>
            token(seq('"', repeat(choice(/[^"\\]/, seq('\\', /./))), '"')),

        unnamed_tuple_body: ($) =>
            choice(
                seq($.rvalue, ','),
                seq($.rvalue, repeat1(seq(',', $.rvalue))),
            ),

        named_tuple_body: ($) =>
            choice(
                seq($.identifier, '=', $.rvalue, ','),
                seq(
                    $.identifier,
                    '=',
                    $.rvalue,
                    repeat1(seq(',', $.identifier, '=', $.rvalue)),
                ),
            ),

        rvalue_list: ($) => seq($.rvalue, repeat(seq(',', $.rvalue))),

        rvalue: ($) => $.expression,

        // Module Expressions
        module_expression: ($) =>
            choice(
                $.paren_module_expression,
                $.primitve_module_expression,
                $.named_module,
                $.compose_module_expression,
                $.union_module_expression,
                $.hide_events_module_expression,
                $.hide_interfaces_module_expression,
                $.assert_module_expression,
                $.rename_module_expression,
                $.main_machine_module_expression,
            ),

        paren_module_expression: ($) => seq('(', $.module_expression, ')'),

        primitve_module_expression: ($) =>
            seq(
                '{',
                field('binds_list', $.bind_expression),
                repeat(seq(',', field('binds_list', $.bind_expression))),
                '}',
            ),

        named_module: ($) => $.identifier,

        compose_module_expression: ($) =>
            prec.right(
                0,
                seq(
                    field('op', 'compose'),
                    field('mexprs', $.module_expression),
                    repeat1(seq(',', field('mexprs', $.module_expression))),
                ),
            ),

        union_module_expression: ($) =>
            prec.right(
                0,
                seq(
                    field('op', 'union'),
                    field('mexprs', $.module_expression),
                    repeat1(seq(',', field('mexprs', $.module_expression))),
                ),
            ),

        hide_events_module_expression: ($) =>
            seq(
                field('op', 'hidee'),
                $.non_default_event_list,
                'in',
                $.module_expression,
            ),

        hide_interfaces_module_expression: ($) =>
            seq(
                field('op', 'hidei'),
                $.identifier_list,
                'in',
                $.module_expression,
            ),

        assert_module_expression: ($) =>
            seq(
                field('op', 'assert'),
                $.identifier_list,
                'in',
                $.module_expression,
            ),

        rename_module_expression: ($) =>
            seq(
                field('op', 'rename'),
                field('old_name', $.identifier),
                'to',
                field('new_name', $.identifier),
                'in',
                $.module_expression,
            ),

        main_machine_module_expression: ($) =>
            seq(
                field('op', 'main'),
                field('main_machine', $.identifier),
                'in',
                $.module_expression,
            ),

        bind_expression: ($) =>
            choice(
                field('m_name', $.identifier),
                seq(
                    field('m_name', $.identifier),
                    '->',
                    field('i_name', $.identifier),
                ),
            ),

        named_module_declaration: ($) =>
            seq(
                'module',
                field('name', $.identifier),
                '=',
                $.module_expression,
                ';',
            ),

        sequence_primitive: ($) =>
            choice($.bool_literal, $.int_literal, seq('-', $.int_literal)),

        sequence_literal_body: ($) =>
            seq($.sequence_primitive, repeat(seq(',', $.sequence_primitive))),

        sequence_literal: ($) => seq('[', $.sequence_literal_body, ']'),

        param_body: ($) =>
            seq(
                field('name', $.identifier),
                'in',
                field('value', $.sequence_literal),
                repeat(
                    seq(
                        ',',
                        field('names', $.identifier),
                        'in',
                        field('value', $.sequence_literal),
                    ),
                ),
            ),

        param: ($) => seq('(', $.param_body, ')'),
    },
});
