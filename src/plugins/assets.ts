import 'katex/dist/katex.min.css'
import '../styles/global.less'
import '../styles/lib/github-markdown.less'
import '../styles/lib/highlight.less'
import '../styles/lib/tailwind.css'

/** Tailwind's Preflight Style Override */
function naiveStyleOverride() {
    const meta = document.createElement('meta')
    meta.name = 'naive-ui-style'
    document.head.appendChild(meta)
}

function setupAssets() {
    naiveStyleOverride()
}

export default setupAssets