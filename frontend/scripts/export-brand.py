"""Export the actual brand type as paths, without relying on installed fonts."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont

root=Path(__file__).resolve().parents[1]
font=TTFont(root/'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')
font=instantiateVariableFont(font,{'wght':500},inplace=False)
glyphs=font.getGlyphSet();cmap=font.getBestCmap();upm=font['head'].unitsPerEm
paths=[];x=0
for char in 'Kebdti':
    name=cmap[ord(char)];pen=SVGPathPen(glyphs);glyphs[name].draw(pen)
    paths.append(f'<path transform="translate({x} 0)" d="{pen.getCommands()}"/>')
    x+=font['hmtx'].metrics[name][0]-25
scale=49/upm
mark='<path d="M30 15C18-2 0 9 5 25c3 10 15 19 25 28V15ZM34 15C46-2 64 9 59 25c-3 10-15 19-25 28V15Z"/>'
bars='<path fill="none" stroke="#fffaf6" stroke-width="3.5" stroke-linecap="round" d="M15 20v8m7-12v16m20-16v16m7-12v8"/>'
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 80"><title>Kebdti — two voices, one heart</title><g fill="#b64e3b" transform="translate(0 9)">{mark}{bars}</g><g fill="#2d2925" transform="translate(82 56) scale({scale} {-scale})">{"".join(paths)}</g></svg>'
(root/'public/brand/kebdti-logo.svg').write_text(svg,encoding='utf-8')
(root/'public/brand/kebdti-mark.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>Kebdti — two voices, one heart</title><g fill="#b64e3b">{mark}{bars}</g></svg>',encoding='utf-8')
print('Exported a portable outlined wordmark and optically rounded voice bars')
