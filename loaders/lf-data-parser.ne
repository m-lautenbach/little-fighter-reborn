main -> bmp _ (frame _):+
	{% ([{ v: bmp }, , frames]) => ({bmp, frames: frames.map(([{ v }]) => v) }) %}

frame ->
	"<frame>" _ int _ string _
		attributes _
		(bpoint _):?
		(cpoint _):?
		(opoint _):?
		(wpoint _):?
		(itr _):*
		(bdy _):*
	"<frame_end>" {% function(d) {return {v: {
					index: d[2].v,
					animation: d[4].v,
					...d[6].v,
					...(d[8] ? { bpoint: d[8][0].v } : {}),
					...(d[9] ? { cpoint: d[9][0].v } : {}),
					...(d[10] ? { opoint: d[10][0].v } : {}),
					...(d[11] ? { wpoint: d[11][0].v } : {}),
					...(d[12][0] ? { itr: d[12].map(([{v}]) => v) } : {}),
					...(d[13][0] ? { bdy: d[13].map(([{v}]) => v) } : {}),
				  }}} %}

bpoint -> "bpoint:" _ attributes _ "bpoint_end:"  {% function(d) {return {v: d[2].v }} %}
cpoint -> "cpoint:" _ attributes _ "cpoint_end:"  {% function(d) {return {v: d[2].v }} %}
opoint -> "opoint:" _ attributes _ "opoint_end:"  {% function(d) {return {v: d[2].v }} %}
wpoint -> "wpoint:" _ attributes _ "wpoint_end:"  {% function(d) {return {v: d[2].v }} %}

itr ->
	"itr:" _
		attributes _
		("catchingact:" _ int _ int _):?
		("caughtact:" _ int _ int _):?
	"itr_end:"   {% function(d) {return {v: {
					itr: {
						...d[2].v,
						...(d[5] ? {catchingact: [d[7], d[9]]} : {}),
						...(d[5] ? {catchingact: [d[7], d[9]]} : {})
					}
				 }}} %}

bdy ->
	"bdy:" _
		attributes _
	"bdy_end:"   {% function(d) {return {v: d[2].v }} %}

bmp -> "<bmp_begin>" _ attributes _ "<bmp_end>"  {% function(d) {return {v: d[2].v}} %}

attributes ->
	attribute {% function(d) {return {v:d[0].v}} %}
	| attribute _ attributes  {% function(d) {return {v: {...d[0].v, ...d[2].v}}} %}

attribute ->
	key (" " | ": ") value {% function(d) {return {v: { [d[0].v]: d[2].v }}} %}
	| sprite_index {% function(d) {return {v: d[0].v }} %}

sprite_index ->
	"file(" int "-" int "):" _ string _ "w:" _ int _ "h:" _ int _ "row:" _ int _ "col:" _ int
 {% function(d) {return {v: { ["frames_" + d[3].v]: {
	file: d[6].v, start: d[1].v, end: d[3].v, w: d[10].v, h: d[14].v, row: d[18].v, col: d[22].v,
 }}}} %}

key -> [a-zA-Z_]:+ {% function(d) {return {v:d[0].join("")}} %}

value ->
	int {% function(d) {return {v:d[0].v}} %}
	| float {% function(d) {return {v:d[0].v}} %}
	| string {% function(d) {return {v:d[0].v}} %}

string -> [a-zA-Z_] [a-zA-Z0-9_\\.]:+ {% function(d) {return {v: [d[0]].concat(d[1]).join('') }} %}

float ->
  int "." uInt  {% function(d) {return {v: parseFloat(`${d[0].v}${d[1]}${d[2].v}`)}} %}

int -> [\-]:? uInt         {% function(d) {return {v: (d[0] ? -1 : 1) * d[1].v}} %}

uInt ->  [0-9]:+        {% function(d) {return {v:parseInt(d[0].join(""))}} %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% function(d) {return null } %}














