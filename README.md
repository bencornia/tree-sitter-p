# tree-sitter-p

A [tree-sitter](https://tree-sitter.github.io/) grammar for the
[P programming language](https://github.com/p-org/P), following the P
compiler's own grammar,
[PParser.g4](https://github.com/p-org/P/blob/master/Src/PCompiler/CompilerCore/Parser/PParser.g4).

It's the parser behind [ptools](https://github.com/bencornia/ptools): plsp,
the P language server; pfmt, the formatter; pdoc, the documentation
generator; and prdb, the replay debugger. For editing P, start there.

## Queries

`queries/` holds the queries editors use:

- `highlights.scm`: syntax highlighting
- `locals.scm`: scopes, definitions and references
- `tags.scm`: symbols for code navigation
- `textobjects.scm`: functions, machines, parameters, comments and tests, as text objects
- `indents.scm`: indentation

## Using it

**Helix**: plsp's README has the
[setup](https://github.com/bencornia/ptools/tree/main/cmd/plsp#helix), which
builds this grammar and installs its queries.

**Go**: the binding is an ordinary module:

```sh
go get github.com/bencornia/tree-sitter-p
```

```go
import (
	tree_sitter_p "github.com/bencornia/tree-sitter-p/bindings/go"
	sitter "github.com/tree-sitter/go-tree-sitter"
)

parser := sitter.NewParser()
parser.SetLanguage(sitter.NewLanguage(tree_sitter_p.Language()))
```

There are also bindings for C, Node, Python, Rust and Swift, in `bindings/`.

## Developing

With the [tree-sitter CLI](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html):

```sh
tree-sitter generate   # regenerate src/ from grammar.js
tree-sitter test       # run the tests in test/corpus
```

The generated parser in `src/` is committed, so the bindings build without
the CLI. To try a change in ptools before pushing it, use a Go workspace
there, as its README describes.

## License

MIT
