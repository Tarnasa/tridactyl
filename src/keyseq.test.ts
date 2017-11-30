import {testAll, testAllNoError, testAllObject} from './test_utils'
import * as ks from './keyseq'
import {mapstrToKeyseq as mks} from './keyseq'

function mk(k, mod?: ks.KeyModifiers) {
    return new ks.MinimalKey(k, mod)
}

{ // {{{ parse and completions

const keymap = new Map([
    [[mk('u', {ctrlKey: true}), mk('j')], "scrollline 10"],
    [[mk('g'), mk('g')], "scrolltop"],
    [mks('<SA-Escape>'), "rarelyusedcommand"],
])

// This one actually found a bug once!
testAllObject(ks.parse, [
    [
        [[mk('g')], keymap],
        {keys: [mk('g')]}
    ],
    [
        [[mk('g'), mk('g')], keymap],
        {exstr: 'scrolltop'}
    ],
    [
        [[mk('Escape', {shiftKey: true, altKey: true})], keymap],
        {exstr: 'rarelyusedcommand'}
    ],
])

testAllObject(ks.completions, [
    [
        [[mk('g')], keymap],
        new Map([[[mk('g'), mk('g')], "scrolltop"]])
    ],
    [
        [mks('<C-u>j'), keymap],
        new Map([[mks('<C-u>j'), 'scrollline 10']])
    ],
])

} // }}}

// {{{ mapstr ->  keysequence

testAll(ks.bracketexprToKey, [
    ['<C-a><CR>', [mk('a', {ctrlKey:true}), '<CR>']],
    ['<M-<>', [mk('<', {metaKey:true}), '']],
    ['<M-<>Foo', [mk('<', {metaKey:true}), 'Foo']],
    ['<M-a>b', [mk('a', {metaKey:true}), 'b']],
    ['<S-Escape>b', [mk('Escape', {shiftKey:true}), 'b']],
    ['<Tab>b', [mk('Tab'), 'b']],
    ['<>b', [mk('<'), '>b']],
    ['<tag >', [mk('<'), 'tag >']],
])

testAllObject(ks.mapstrMapToKeyMap, [
    [
        new Map([['j', 'scrollline 10'], ['gg', 'scrolltop']]),
        new Map([
            [[mk('j')], "scrollline 10"],
            [[mk('g'), mk('g')], "scrolltop"]]
        )
    ],
    [
        new Map([['<C-u>j', 'scrollline 10'], ['gg', 'scrolltop']]),
        new Map([
            [[mk('u', {ctrlKey: true}), mk('j')], "scrollline 10"],
            [[mk('g'), mk('g')], "scrolltop"]]
        )
    ],
])

testAllObject(ks.mapstrToKeyseq, [
    ['Some string',
        [{"altKey": false, "ctrlKey": false, "key": "S", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "o", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "m", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "e", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": " ", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "s", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "t", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "r", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "i", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "n", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "g", "metaKey": false, "shiftKey": false}]],
    ['hi<c-u>t<A-Enter>here',
        [{"altKey": false, "ctrlKey": false, "key": "h", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "i", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": true, "key": "u", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "t", "metaKey": false, "shiftKey": false},{"altKey": true, "ctrlKey": false, "key": "Enter", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "h", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "e", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "r", "metaKey" : false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "e", "metaKey": false, "shiftKey": false}]],
    ['wat\'s up <s-Escape>',
        [{"altKey": false, "ctrlKey": false, "key": "w", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "a", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "t", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "'", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "s", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": " ", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "u", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "p", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": " ", "metaKey": false, "shiftKey": false}, {"altKey": false, "ctrlKey": false, "key": "Escape", "metaKey": false, "shiftKey": true}]],
    ['wat\'s up <s-Escape>', mks("wat's up <s-Escape>")],
])

// Check order of modifiers doesn't matter
// Check aliases
testAllObject(mks, [
    ['<SAC-cr>', mks('<ASC-return>')],
    ['<ACM-lt>', mks('<CAM-<>')],
])

// }}}
