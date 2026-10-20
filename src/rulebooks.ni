"The Kapellmeister's Rulebooks" by Edmark's Esoteric Fun Machine

[The music-theory genres of the Kapellmeister console, written in a strict subset of Inform 7 (D-033) and read by src/inform.mjs. Everything a genre decides lives here: its chord colours, its changes, its Fun Machine progressions, how its melody snaps, how its bass walks, how its organ voices chords, and which overtones its chimes ring. The few true algorithms a genre may name (the Tonnetz walk, the Euler sieve, contrary motion, cell choosing, inverted triads) stay in src/conductor.mjs.]

[Departures from real Inform 7, on purpose: rules fire in source order and the first match wins; a changes table counts its rows by "region" (three steps each) or by "step" (twelve rows).]

Part 1 - The furniture

Chapter 1 - Kinds

A genre is a kind of thing.

Chord quality is a kind of value. The chord qualities are major, minor, dom7, maj9, min9, dom7alt, dim, modal open, phrygian, lydian and raw.

Chord member is a kind of value. The chord members are root, third, fifth, seventh, ninth and octave.

Tonnetz move is a kind of value. The Tonnetz moves are P, L and R.

Spine method is a kind of value. The spine methods are table reading and Tonnetz walking.

Melody method is a kind of value. The melody methods are Euler sieving, scale snapping, member snapping and chord snapping.

Bass method is a kind of value. The bass methods are cell choosing, walking and contrary motion.

Chapter 2 - What every genre knows

A genre has some text called the code. A genre has some text called the title. A genre has some text called the motto.
A genre can be fettered or unfettered. A genre is usually fettered.
A genre can be patient or insistent. A genre is usually patient.
A genre can be triadic or voiced. A genre is usually triadic.

A genre has a spine method. A genre has a table name called the changes.
A genre has a melody method. A genre has a list of chord members called the melody members. A genre has a list of numbers called the melody extensions.
A genre has a bass method. A genre has a list of numbers called the bass walk.
A genre has a list of chord members called the organ voicing.
A genre has a table name called the overtones.

A chord quality has a table name called the progression.

Chapter 3 - What the conductor tells the rules

The interval above the tonic is a number that varies.
The strictness is a number that varies.

The colouring rules are a genre based rulebook producing a chord quality.
The progression rules are a genre based rulebook producing a table name.
The melody tone rules are a genre based rulebook producing a list of numbers.

Part 2 - The genres

[The order here is the order of the Kapellmeister menu.]

Chapter 1 - Victorian Tonnetz

Victorian Tonnetz is a genre. The code of Victorian Tonnetz is "victorian_tonnetz". The title of Victorian Tonnetz is "VICTORIAN NEO-RIEMANNIAN TONNETZ". The motto of Victorian Tonnetz is "Parsimonious P/L/R voice-leading across 4 harmonic regions with Euler G ≤ 8 consonance."

The spine method of Victorian Tonnetz is Tonnetz walking. The changes of Victorian Tonnetz are the Table of Tonnetz Walks.
The melody method of Victorian Tonnetz is Euler sieving. The bass method of Victorian Tonnetz is cell choosing.
The overtones of Victorian Tonnetz are the Table of Consonant Overtones.

Colouring rule for Victorian Tonnetz when the interval above the tonic is listed in {0, 5, 7}: rule succeeds with result major.
Colouring rule for Victorian Tonnetz: rule succeeds with result minor.

Progression rule for Victorian Tonnetz when the interval above the tonic is listed in {0, 5, 7}: rule succeeds with result the Table of Parlor Vamp.
Progression rule for Victorian Tonnetz: rule succeeds with result the Table of Minor Lament.

Table of Tonnetz Walks
moves
{R, L, P}
{P, R, L}
{L, R, P}
{R, P, L}
{L, P, R}
{R, L, R}
{P, L, R}
{L, R, L}

Chapter 2 - Delta Blues

Delta Blues is an insistent voiced genre. The code of Delta Blues is "blues_twelve_bar". The title of Delta Blues is "12-BAR DELTA & PARLOR BLUES". The motto of Delta Blues is "Authentic I7-IV7-V7 12-bar chord matrix with walking shuffle bass and blue-note sieve."

The changes of Delta Blues are the Table of Delta Blues Changes.
The melody method of Delta Blues is scale snapping.
The bass method of Delta Blues is walking. The bass walk of Delta Blues is {0, 4, 7, 9, 0, 4, 0, 7, 0, 0, 0, 0}.
The organ voicing of Delta Blues is {third, fifth, seventh}.
The overtones of Delta Blues are the Table of Blue Overtones.

Colouring rule for Delta Blues: rule succeeds with result dom7.
Progression rule for Delta Blues: rule succeeds with result the Table of Blues Riff.

[A strict sieve keeps the blues to its chord tones; a loose one lets the blue notes in.]
Melody tone rule for Delta Blues when the strictness is at most 5: rule succeeds with result {0, 4, 7, 10}.
Melody tone rule for Delta Blues: rule succeeds with result {0, 3, 5, 6, 7, 10}.

Table of Delta Blues Changes
step	degree	quality	label	tones
1	0	dom7	"I7"	{0, 4, 7, 10}
2	0	dom7	"I7"	{0, 4, 7, 10}
3	0	dom7	"I7"	{0, 4, 7, 10}
4	0	dom7	"I7"	{0, 4, 7, 10}
5	5	dom7	"IV7"	{0, 4, 7, 10}
6	5	dom7	"IV7"	{0, 4, 7, 10}
7	0	dom7	"I7"	{0, 4, 7, 10}
8	0	dom7	"I7"	{0, 4, 7, 10}
9	7	dom7	"V7"	{0, 4, 7, 10}
10	5	dom7	"IV7"	{0, 4, 7, 10}
11	0	dom7	"I7"	{0, 4, 7, 10}
12	7	dom7	"V7 (Turn)"	{0, 4, 7, 10}

Chapter 3 - Smoky Parlor Jazz

Smoky Parlor Jazz is an insistent voiced genre. The code of Smoky Parlor Jazz is "smoky_jazz". The title of Smoky Parlor Jazz is "SMOKY PARLOR JAZZ & EXTENDED TONNETZ". The motto of Smoky Parlor Jazz is "ii-V-I progressions with rootless 3rd/7th/9th guide tones, swung overtones, and chromatic approaches."

The changes of Smoky Parlor Jazz are the Table of Smoky Jazz Changes.
The melody method of Smoky Parlor Jazz is member snapping. The melody members of Smoky Parlor Jazz are {root, third, fifth, seventh, ninth}. The melody extensions of Smoky Parlor Jazz are {5, 9}.
The bass method of Smoky Parlor Jazz is walking. The bass walk of Smoky Parlor Jazz is {0, 4, 10, 0, 7, 3, 0, 5, 0, 0, 7, 11}.
The organ voicing of Smoky Parlor Jazz is {third, seventh, ninth}.
The overtones of Smoky Parlor Jazz are the Table of Jazz Overtones.

Colouring rule for Smoky Parlor Jazz when the interval above the tonic is listed in {0, 5}: rule succeeds with result maj9.
Colouring rule for Smoky Parlor Jazz when the interval above the tonic is listed in {1, 6, 11}: rule succeeds with result dom7alt.
Colouring rule for Smoky Parlor Jazz: rule succeeds with result min9.
Progression rule for Smoky Parlor Jazz: rule succeeds with result the Table of Jazz Turnaround.

Table of Smoky Jazz Changes
region	degree	quality	label	tones
1	0	maj9	"Imaj9"	{0, 4, 7, 11, 2}
2	9	min9	"vi9"	{0, 3, 7, 10, 2}
3	2	min9	"ii9"	{0, 3, 7, 10, 2}
4	1	dom7alt	"♭II7alt"	{0, 4, 7, 10}

Chapter 4 - Palestrina Counterpoint

Palestrina Counterpoint is a genre. The code of Palestrina Counterpoint is "renaissance_counterpoint". The title of Palestrina Counterpoint is "PALESTRINA MODAL COUNTERPOINT". The motto of Palestrina Counterpoint is "16th-century species counterpoint with prepared suspensions, stepwise motion, and strict G ≤ 5 consonance."

The changes of Palestrina Counterpoint are the Table of Palestrina Changes.
The melody method of Palestrina Counterpoint is Euler sieving. The bass method of Palestrina Counterpoint is contrary motion.
The overtones of Palestrina Counterpoint are the Table of Pythagorean Overtones.

Colouring rule for Palestrina Counterpoint when the interval above the tonic is listed in {0, 2, 5, 7, 9}: rule succeeds with result minor.
Colouring rule for Palestrina Counterpoint: rule succeeds with result major.
Progression rule for Palestrina Counterpoint: rule succeeds with result the Table of Minor Lament.

Table of Palestrina Changes
step	degree	quality	label	tones
1	0	minor	"i (Tonic)"	{0, 3, 7}
2	0	minor	"i (Tonic)"	{0, 3, 7}
3	0	minor	"i (Tonic)"	{0, 3, 7}
4	5	minor	"iv (Susp 4-3)"	{0, 3, 7}
5	5	minor	"iv (Susp 4-3)"	{0, 3, 7}
6	5	minor	"iv (Susp 4-3)"	{0, 3, 7}
7	7	minor	"v (Susp 7-6)"	{0, 3, 7}
8	7	minor	"v (Susp 7-6)"	{0, 3, 7}
9	7	minor	"v (Susp 7-6)"	{0, 3, 7}
10	0	minor	"i (Tonic)"	{0, 3, 7}
11	0	minor	"i (Tonic)"	{0, 3, 7}
12	0	major	"I (Picardy Cadence)"	{0, 4, 7}

Chapter 5 - Mystic Drone

Mystic Drone is an insistent voiced genre. The code of Mystic Drone is "modal_drone". The title of Mystic Drone is "MYSTIC BYZANTINE & HIMALAYAN DRONE". The motto of Mystic Drone is "Hypnotic root & fifth drone pedal with Phrygian dominant microtonal scale ladders and open chords."

The changes of Mystic Drone are the Table of Drone Changes.
The melody method of Mystic Drone is chord snapping.
The bass method of Mystic Drone is walking. The bass walk of Mystic Drone is {0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 7}.
The organ voicing of Mystic Drone is {root, fifth, octave}.
The overtones of Mystic Drone are the Table of Drone Overtones.

Colouring rule for Mystic Drone when the interval above the tonic is 1: rule succeeds with result phrygian.
Colouring rule for Mystic Drone when the interval above the tonic is 6: rule succeeds with result lydian.
Colouring rule for Mystic Drone: rule succeeds with result modal open.
Progression rule for Mystic Drone: rule succeeds with result the Table of Drone Ladder.

Table of Drone Changes
region	degree	quality	label	tones
1	0	modal open	"Tonic 1-5 Drone"	{0, 7, 2}
2	0	phrygian	"Phrygian Inflection"	{0, 1, 4, 7}
3	0	lydian	"Lydian Mystic (#4)"	{0, 6, 7, 11}
4	0	modal open	"Harmonic 7th Return"	{0, 7, 10}

Chapter 6 - Parlor Ragtime

[A Joplin-style strain for the parlor upright: the bass goes "oom" on the root and fifth, the organ answers "pah", and secondary dominants march the tune home.]

Parlor Ragtime is an insistent voiced genre. The code of Parlor Ragtime is "parlor_ragtime". The title of Parlor Ragtime is "PARLOR RAGTIME & CAKEWALK STRAINS". The motto of Parlor Ragtime is "Joplin-style strains: an oom-pah stride bass, sixth-chord melodies, and secondary dominants marching home through VI7, II7, and V7."

The changes of Parlor Ragtime are the Table of Ragtime Changes.
The melody method of Parlor Ragtime is member snapping. The melody members of Parlor Ragtime are {root, third, fifth}. The melody extensions of Parlor Ragtime are {9}.
The bass method of Parlor Ragtime is walking. The bass walk of Parlor Ragtime is {0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 2, 4}.
The organ voicing of Parlor Ragtime is {third, fifth, octave}.
The overtones of Parlor Ragtime are the Table of Ragtime Overtones.

[Tonic and subdominant ring major; the dominant family (II, III, V, VI, and the flat seventh) gets its seventh; the in-between keys are passing diminished chords.]
Colouring rule for Parlor Ragtime when the interval above the tonic is listed in {0, 5}: rule succeeds with result major.
Colouring rule for Parlor Ragtime when the interval above the tonic is listed in {2, 4, 7, 9, 10}: rule succeeds with result dom7.
Colouring rule for Parlor Ragtime: rule succeeds with result dim.
Progression rule for Parlor Ragtime: rule succeeds with result the Table of Parlor Rag.

[The bass walk climbs 2 and 4 above V7 on the last two steps, A and B in C, so the strain steps back up to the tonic.]

Table of Ragtime Changes
step	degree	quality	label	tones
1	0	major	"I"	{0, 4, 7}
2	0	major	"I"	{0, 4, 7}
3	0	dom7	"I7"	{0, 4, 7, 10}
4	5	major	"IV"	{0, 4, 7}
5	5	major	"IV"	{0, 4, 7}
6	6	dim	"♯iv°"	{0, 3, 6, 9}
7	0	major	"I"	{0, 4, 7}
8	0	major	"I"	{0, 4, 7}
9	9	dom7	"VI7"	{0, 4, 7, 10}
10	2	dom7	"II7"	{0, 4, 7, 10}
11	7	dom7	"V7"	{0, 4, 7, 10}
12	7	dom7	"V7"	{0, 4, 7, 10}

Table of Ragtime Overtones
ratio
"1/1"
"5/4"
"4/3"
"3/2"
"5/3"
"7/4"
"2/1"

Chapter 7 - Raw Esoteric Chaos

[Unfettered: the conductor leaves every VM's raw output alone, so only what the Fun Machine needs is written down.]

Raw Esoteric Chaos is an unfettered genre. The code of Raw Esoteric Chaos is "raw_chaos". The title of Raw Esoteric Chaos is "RAW ESOTERIC CHAOS (UNFETTERED VMS)". The motto of Raw Esoteric Chaos is "Zero harmonic filtration. Raw, native, unquantized mathematical outputs from all six esoteric virtual machines."

The overtones of Raw Esoteric Chaos are the Table of Consonant Overtones.

Colouring rule for Raw Esoteric Chaos: rule succeeds with result raw.
Progression rule for Raw Esoteric Chaos: rule succeeds with result the Table of Parlor Vamp.

Part 3 - The Fun Machine's progressions

[Each row is one region of three steps: the chord's root above the key, its quality, the three melody notes above the key, and how the summary shows it.]

The progression of major is the Table of Parlor Vamp.
The progression of minor is the Table of Minor Lament.
The progression of dom7 is the Table of Blues Riff.
The progression of maj9 is the Table of Jazz Turnaround.
The progression of min9 is the Table of Parlor Vamp.
The progression of dom7alt is the Table of Parlor Vamp.
The progression of dim is the Table of Diminished Circle.
The progression of modal open is the Table of Drone Ladder.
The progression of phrygian is the Table of Parlor Vamp.
The progression of lydian is the Table of Parlor Vamp.
The progression of raw is the Table of Parlor Vamp.

Table of Parlor Vamp
degree	quality	melody	shown
0	major	{0, 4, 7}	"[root] Maj"
9	minor	{9, 12, 9}	"[root]m"
5	major	{5, 9, 12}	"[root] Maj"
7	major	{7, 11, 14}	"[root] Maj"

Table of Minor Lament
degree	quality	melody	shown
0	minor	{0, 3, 7}	"[root]m"
8	major	{8, 12, 8}	"[root] Maj"
5	minor	{5, 8, 12}	"[root]m"
7	major	{7, 11, 14}	"[root] Maj"

Table of Blues Riff
degree	quality	melody	shown
0	dom7	{0, 4, 7}	"[root]7"
5	dom7	{5, 3, 5}	"[root]7"
7	dom7	{7, 6, 7}	"[root]7"
0	dom7	{10, 7, 6}	"[root]7"

Table of Jazz Turnaround
degree	quality	melody	shown
0	maj9	{14, 11, 7}	"[root]maj9"
9	min9	{11, 7, 3}	"[root]m9"
2	min9	{4, 0, 5}	"[root]m9"
7	dom7alt	{8, 5, 0}	"[root]7alt"

Table of Drone Ladder
degree	quality	melody	shown
0	modal open	{0, 7, 12}	"[root] Drone"
0	phrygian	{1, 4, 7}	"Phryg"
0	lydian	{6, 7, 11}	"Lydian"
0	modal open	{10, 7, 0}	"7th"

Table of Parlor Rag
degree	quality	melody	shown
0	major	{4, 7, 9}	"[root] Maj"
0	dom7	{10, 9, 7}	"[root]7"
5	major	{9, 12, 14}	"[root] Maj"
7	dom7	{11, 14, 5}	"[root]7"

Table of Diminished Circle
degree	quality	melody	shown
0	dim	{0, 3, 6}	"[root]°"
3	dim	{3, 6, 9}	"[root]°"
6	dim	{6, 9, 12}	"[root]°"
9	dim	{9, 6, 3}	"[root]°"

Part 4 - The chimes' overtones

[Just-intonation ratios the Piet and FRACTRAN chimes may ring above each chord root.]

Table of Consonant Overtones
ratio
"1/1"
"9/8"
"6/5"
"5/4"
"4/3"
"3/2"
"5/3"
"2/1"

Table of Blue Overtones
ratio
"1/1"
"7/6"
"6/5"
"5/4"
"4/3"
"7/5"
"3/2"
"7/4"
"2/1"

Table of Jazz Overtones
ratio
"1/1"
"9/8"
"5/4"
"11/8"
"3/2"
"13/8"
"7/4"
"2/1"

Table of Pythagorean Overtones
ratio
"1/1"
"9/8"
"4/3"
"3/2"
"16/9"
"2/1"

Table of Drone Overtones
ratio
"1/1"
"9/8"
"5/4"
"4/3"
"3/2"
"7/4"
"2/1"
