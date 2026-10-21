"The Kapellmeister's Rulebooks" by Edmark's Esoteric Fun Machine

[The music-theory genres of the Kapellmeister console, written in a strict subset of Inform 7 (D-033) and read by src/inform.mjs. Everything a genre decides lives here: its chord colours, its changes, its Fun Machine progressions, how its melody snaps, how its bass walks, how its organ voices chords, and which overtones its chimes ring. The few true algorithms a genre may name (the Tonnetz walk, the Euler sieve, contrary motion, cell choosing, inverted triads) stay in src/conductor.mjs.]

[Departures from real Inform 7, on purpose: rules fire in source order and the first match wins; a changes table counts its rows by "region" (three steps each) or by "step" (twelve rows).]

Part 1 - The furniture

Chapter 1 - Kinds

A genre is a kind of thing.

Chord quality is a kind of value. The chord qualities are major, minor, dom7, maj9, min9, dom7alt, dim, modal open, phrygian, lydian, raw, min7, maj7, half-diminished, augmented, sus4 and major 6.

Chord member is a kind of value. The chord members are root, third, fifth, seventh, ninth and octave.

Tonnetz move is a kind of value. The Tonnetz moves are P, L and R.

Spine method is a kind of value. The spine methods are table reading and Tonnetz walking.

Melody method is a kind of value. The melody methods are Euler sieving, scale snapping, member snapping and chord snapping.

Bass method is a kind of value. The bass methods are cell choosing, walking and contrary motion.

[How a creature may vary a genre's changes (D-043). The creature's own harmony fields choose among the moves its genre permits; a genre that permits none always plays as written.]
Variation move is a kind of value. The variation moves are rotation, relative substitution, tritone substitution, secondary dominants, modal borrowing, deceptive cadence, plagal cadence, phrygian cadence, authentic cadence and harmonic pace.

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
A genre has a list of variation moves called the permitted moves.
A genre has some text called the family.

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
The family of Victorian Tonnetz is "PARLOR".

The spine method of Victorian Tonnetz is Tonnetz walking. The changes of Victorian Tonnetz are the Table of Tonnetz Walks.
The melody method of Victorian Tonnetz is Euler sieving. The bass method of Victorian Tonnetz is cell choosing.
The overtones of Victorian Tonnetz are the Table of Consonant Overtones.
The permitted moves of Victorian Tonnetz are {relative substitution, modal borrowing, deceptive cadence, plagal cadence, harmonic pace}.

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
The family of Delta Blues is "NIGHT CLUB".

The changes of Delta Blues are the Table of Delta Blues Changes.
The melody method of Delta Blues is scale snapping.
The bass method of Delta Blues is walking. The bass walk of Delta Blues is {0, 4, 7, 9, 0, 4, 0, 7, 0, 0, 0, 0}.
The organ voicing of Delta Blues is {third, fifth, seventh}.
The overtones of Delta Blues are the Table of Blue Overtones.
The permitted moves of Delta Blues are {tritone substitution, secondary dominants, plagal cadence, harmonic pace}.

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
The family of Smoky Parlor Jazz is "NIGHT CLUB".

The changes of Smoky Parlor Jazz are the Table of Smoky Jazz Changes.
The melody method of Smoky Parlor Jazz is member snapping. The melody members of Smoky Parlor Jazz are {root, third, fifth, seventh, ninth}. The melody extensions of Smoky Parlor Jazz are {5, 9}.
The bass method of Smoky Parlor Jazz is walking. The bass walk of Smoky Parlor Jazz is {0, 4, 10, 0, 7, 3, 0, 5, 0, 0, 7, 11}.
The organ voicing of Smoky Parlor Jazz is {third, seventh, ninth}.
The overtones of Smoky Parlor Jazz are the Table of Jazz Overtones.
The permitted moves of Smoky Parlor Jazz are {rotation, relative substitution, tritone substitution, secondary dominants, deceptive cadence, harmonic pace}.

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
The family of Palestrina Counterpoint is "SACRED & EARLY".

The changes of Palestrina Counterpoint are the Table of Palestrina Changes.
The melody method of Palestrina Counterpoint is Euler sieving. The bass method of Palestrina Counterpoint is contrary motion.
The overtones of Palestrina Counterpoint are the Table of Pythagorean Overtones.
The permitted moves of Palestrina Counterpoint are {relative substitution, phrygian cadence, plagal cadence}.

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
The family of Mystic Drone is "ESOTERIC".

The changes of Mystic Drone are the Table of Drone Changes.
The melody method of Mystic Drone is chord snapping.
The bass method of Mystic Drone is walking. The bass walk of Mystic Drone is {0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 7}.
The organ voicing of Mystic Drone is {root, fifth, octave}.
The overtones of Mystic Drone are the Table of Drone Overtones.
The permitted moves of Mystic Drone are {rotation, phrygian cadence, harmonic pace}.

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
The family of Parlor Ragtime is "PARLOR".

The changes of Parlor Ragtime are the Table of Ragtime Changes.
The melody method of Parlor Ragtime is member snapping. The melody members of Parlor Ragtime are {root, third, fifth}. The melody extensions of Parlor Ragtime are {9}.
The bass method of Parlor Ragtime is walking. The bass walk of Parlor Ragtime is {0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 2, 4}.
The organ voicing of Parlor Ragtime is {third, fifth, octave}.
The overtones of Parlor Ragtime are the Table of Ragtime Overtones.
The permitted moves of Parlor Ragtime are {relative substitution, tritone substitution, secondary dominants, modal borrowing, deceptive cadence, harmonic pace}.

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

Chapter 7 - Doo-Wop Parlor Ballad

[Four voices on a street-corner stoop: the "ice-cream changes" I, vi, IV, V, a triplet bass that rocks through each chord, and a melody that stays on its chord tones with a sweet sixth.]

Doo-Wop Ballad is a patient triadic genre. The code of Doo-Wop Ballad is "doowop_ballad". The title of Doo-Wop Ballad is "DOO-WOP PARLOR BALLAD". The motto of Doo-Wop Ballad is "The ice-cream changes, I-vi-IV-V, with a rocking triplet bass and a sweet-sixth street-corner melody."
The family of Doo-Wop Ballad is "PARLOR".

The changes of Doo-Wop Ballad are the Table of Doo-Wop Changes.
The melody method of Doo-Wop Ballad is member snapping. The melody members of Doo-Wop Ballad are {root, third, fifth}. The melody extensions of Doo-Wop Ballad are {9}.
The bass method of Doo-Wop Ballad is walking. The bass walk of Doo-Wop Ballad is {0, 4, 7, 0, 4, 7, 0, 4, 7, 0, 4, 7}.
The overtones of Doo-Wop Ballad are the Table of Consonant Overtones.
The permitted moves of Doo-Wop Ballad are {relative substitution, secondary dominants, deceptive cadence, plagal cadence}.

Colouring rule for Doo-Wop Ballad when the interval above the tonic is listed in {2, 4, 9}: rule succeeds with result minor.
Colouring rule for Doo-Wop Ballad when the interval above the tonic is 7: rule succeeds with result dom7.
Colouring rule for Doo-Wop Ballad: rule succeeds with result major.
Progression rule for Doo-Wop Ballad: rule succeeds with result the Table of Ice-Cream Changes.

Table of Doo-Wop Changes
region	degree	quality	label	tones
1	0	major	"I"	{0, 4, 7}
2	9	minor	"vi"	{0, 3, 7}
3	5	major	"IV"	{0, 4, 7}
4	7	dom7	"V7"	{0, 4, 7, 10}

Chapter 8 - Sacred Harp Shape-Note

[A singing school in a country meeting house: open fifths without thirds, the flat seventh and minor fifth of the old modes, a stern bass that holds the root, and Pythagorean bells.]

Sacred Harp is an insistent voiced genre. The code of Sacred Harp is "sacred_harp". The title of Sacred Harp is "SACRED HARP SHAPE-NOTE HYMNODY". The motto of Sacred Harp is "Fa-sol-la singing-school hymns: open fifths, the old modes' flat seventh, a stern pedal bass, and fourths and fifths in the bells."
The family of Sacred Harp is "SACRED & EARLY".

The changes of Sacred Harp are the Table of Shape-Note Changes.
The melody method of Sacred Harp is member snapping. The melody members of Sacred Harp are {root, third, fifth, octave}. The melody extensions of Sacred Harp are {}.
The bass method of Sacred Harp is walking. The bass walk of Sacred Harp is {0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 7, 0}.
The organ voicing of Sacred Harp is {root, fifth, octave}.
The overtones of Sacred Harp are the Table of Pythagorean Overtones.
The permitted moves of Sacred Harp are {relative substitution, plagal cadence, harmonic pace}.

Colouring rule for Sacred Harp when the interval above the tonic is listed in {0, 10}: rule succeeds with result modal open.
Colouring rule for Sacred Harp when the interval above the tonic is listed in {3, 5, 8}: rule succeeds with result major.
Colouring rule for Sacred Harp when the interval above the tonic is listed in {2, 7}: rule succeeds with result minor.
Colouring rule for Sacred Harp: rule succeeds with result modal open.
Progression rule for Sacred Harp: rule succeeds with result the Table of Fasola Lament.

Table of Shape-Note Changes
region	degree	quality	label	tones
1	0	modal open	"i5 (Open)"	{0, 7}
2	10	modal open	"♭VII5 (Open)"	{0, 7}
3	3	major	"♭III"	{0, 4, 7}
4	7	minor	"v (Modal)"	{0, 3, 7}

Chapter 9 - Andalusian Flamenco

[The Andalusian cadence: minor tonic, then the bass steps down through the flat seventh and flat sixth to a dominant that carries the Phrygian flat ninth.]

Andalusian Flamenco is an insistent triadic genre. The code of Andalusian Flamenco is "andalusian_flamenco". The title of Andalusian Flamenco is "ANDALUSIAN FLAMENCO CADENCE". The motto of Andalusian Flamenco is "i-♭VII-♭VI-V stepping down to a Phrygian dominant with its flat ninth, over a rasgueado bass."
The family of Andalusian Flamenco is "FOLK & DANCE".

The changes of Andalusian Flamenco are the Table of Andalusian Changes.
The melody method of Andalusian Flamenco is member snapping. The melody members of Andalusian Flamenco are {root, third, fifth}. The melody extensions of Andalusian Flamenco are {}.
The bass method of Andalusian Flamenco is walking. The bass walk of Andalusian Flamenco is {0, 7, 0, 0, 7, 0, 0, 7, 0, 0, 4, 0}.
The overtones of Andalusian Flamenco are the Table of Consonant Overtones.
The permitted moves of Andalusian Flamenco are {phrygian cadence, relative substitution, harmonic pace}.

Colouring rule for Andalusian Flamenco when the interval above the tonic is 7: rule succeeds with result phrygian.
Colouring rule for Andalusian Flamenco when the interval above the tonic is listed in {1, 3, 8, 10}: rule succeeds with result major.
Colouring rule for Andalusian Flamenco: rule succeeds with result minor.
Progression rule for Andalusian Flamenco: rule succeeds with result the Table of Andalusian Cadence.

Table of Andalusian Changes
region	degree	quality	label	tones
1	0	minor	"i"	{0, 3, 7}
2	10	major	"♭VII"	{0, 4, 7}
3	8	major	"♭VI"	{0, 4, 7}
4	7	phrygian	"V (Phrygian ♭9)"	{0, 1, 4, 7}

Chapter 10 - Klezmer Freygish

[The freygish mode: a major tonic with a flat second beside it, the minor iv and flat vii of a dance band, and a melody that can reach the augmented second.]

Klezmer Freygish is an insistent voiced genre. The code of Klezmer Freygish is "klezmer_freygish". The title of Klezmer Freygish is "KLEZMER FREYGISH DANCE". The motto of Klezmer Freygish is "The freygish mode: a major tonic beside its flat second, minor iv and ♭vii, an oom-pah bass, and augmented-second turns."
The family of Klezmer Freygish is "FOLK & DANCE".

The changes of Klezmer Freygish are the Table of Freygish Changes.
The melody method of Klezmer Freygish is scale snapping.
The bass method of Klezmer Freygish is walking. The bass walk of Klezmer Freygish is {0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7}.
The organ voicing of Klezmer Freygish is {third, fifth, octave}.
The overtones of Klezmer Freygish are the Table of Consonant Overtones.
The permitted moves of Klezmer Freygish are {relative substitution, phrygian cadence, harmonic pace}.

Colouring rule for Klezmer Freygish when the interval above the tonic is 0: rule succeeds with result phrygian.
Colouring rule for Klezmer Freygish when the interval above the tonic is listed in {1, 3, 7}: rule succeeds with result major.
Colouring rule for Klezmer Freygish: rule succeeds with result minor.
Progression rule for Klezmer Freygish: rule succeeds with result the Table of Freygish Turn.

[A strict sieve keeps to chord tones; a loose one admits the mode's flat second and sixth, so the augmented second (♭2 to 3) can sing.]
Melody tone rule for Klezmer Freygish when the strictness is at most 6: rule succeeds with result {0, 4, 7}.
Melody tone rule for Klezmer Freygish: rule succeeds with result {0, 1, 4, 5, 7, 8, 10}.

Table of Freygish Changes
region	degree	quality	label	tones
1	0	phrygian	"I (Freygish)"	{0, 1, 4, 7}
2	5	minor	"iv"	{0, 3, 7}
3	10	minor	"♭vii"	{0, 3, 7}
4	1	major	"♭II"	{0, 4, 7}

Chapter 11 - Sea Shanty & Hornpipe

[Capstan and halyard: I, IV, I, V in plain major, a hornpipe bass, and an open bagpipe organ.]

Sea Shanty is an insistent voiced genre. The code of Sea Shanty is "sea_shanty". The title of Sea Shanty is "SEA SHANTY & HORNPIPE". The motto of Sea Shanty is "Capstan and halyard songs: I-IV-I-V in plain major, a hornpipe bass, and an open bagpipe organ."
The family of Sea Shanty is "FOLK & DANCE".

The changes of Sea Shanty are the Table of Shanty Changes.
The melody method of Sea Shanty is member snapping. The melody members of Sea Shanty are {root, third, fifth}. The melody extensions of Sea Shanty are {}.
The bass method of Sea Shanty is walking. The bass walk of Sea Shanty is {0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7}.
The organ voicing of Sea Shanty is {root, fifth, octave}.
The overtones of Sea Shanty are the Table of Consonant Overtones.
The permitted moves of Sea Shanty are {plagal cadence, relative substitution, harmonic pace}.

Colouring rule for Sea Shanty when the interval above the tonic is listed in {2, 4, 9}: rule succeeds with result minor.
Colouring rule for Sea Shanty: rule succeeds with result major.
Progression rule for Sea Shanty: rule succeeds with result the Table of Capstan Shanty.

Table of Shanty Changes
region	degree	quality	label	tones
1	0	major	"I"	{0, 4, 7}
2	5	major	"IV"	{0, 4, 7}
3	0	major	"I"	{0, 4, 7}
4	7	major	"V"	{0, 4, 7}

Chapter 12 - Silent-Film Lydian

[A picture-palace pianist under a dreaming heroine: major ninths, the bright raised fourth of the Lydian mode, and a melody that floats on chord tones and the raised fourth.]

Silent-Film Lydian is a patient triadic genre. The code of Silent-Film Lydian is "silent_film_lydian". The title of Silent-Film Lydian is "SILENT-FILM LYDIAN DREAM". The motto of Silent-Film Lydian is "A picture-palace pianist's reverie: major ninths, the raised fourth's major II, and a melody floating on the Lydian fourth."
The family of Silent-Film Lydian is "PARLOR".

The changes of Silent-Film Lydian are the Table of Lydian Changes.
The melody method of Silent-Film Lydian is member snapping. The melody members of Silent-Film Lydian are {root, third, fifth, ninth}. The melody extensions of Silent-Film Lydian are {6}.
The bass method of Silent-Film Lydian is walking. The bass walk of Silent-Film Lydian is {0, 7, 4, 0, 7, 4, 0, 7, 4, 0, 7, 11}.
The overtones of Silent-Film Lydian are the Table of Consonant Overtones.
The permitted moves of Silent-Film Lydian are {rotation, relative substitution, deceptive cadence, harmonic pace}.

Colouring rule for Silent-Film Lydian when the interval above the tonic is listed in {0, 7}: rule succeeds with result maj9.
Colouring rule for Silent-Film Lydian when the interval above the tonic is 2: rule succeeds with result major.
Colouring rule for Silent-Film Lydian when the interval above the tonic is listed in {4, 9, 11}: rule succeeds with result minor.
Colouring rule for Silent-Film Lydian: rule succeeds with result lydian.
Progression rule for Silent-Film Lydian: rule succeeds with result the Table of Picture Palace.

Table of Lydian Changes
region	degree	quality	label	tones
1	0	maj9	"Imaj9"	{0, 4, 7, 11, 2}
2	2	major	"II (raised fourth)"	{0, 4, 7}
3	11	minor	"vii"	{0, 3, 7}
4	0	lydian	"I (Lydian)"	{0, 6, 7, 11}

Chapter 13 - Bossa Nova Salon

[Breezy syncopated parlor bossa: maj7 on the tonic, ii7 and V7, an alternating root-fifth bass, and guide-tone organ voicings.]

Bossa Nova Salon is a patient voiced genre. The code of Bossa Nova Salon is "bossa_nova_salon". The title of Bossa Nova Salon is "BOSSA NOVA SALON". The motto of Bossa Nova Salon is "Imaj7-vi7-ii7-V7 changes with root-fifth anticipations, guide-tone organ voicings, and breezy parlor syncopation."
The family of Bossa Nova Salon is "NIGHT CLUB".

The changes of Bossa Nova Salon are the Table of Bossa Changes.
The melody method of Bossa Nova Salon is member snapping. The melody members of Bossa Nova Salon are {root, third, fifth, seventh}. The melody extensions of Bossa Nova Salon are {}.
The bass method of Bossa Nova Salon is walking. The bass walk of Bossa Nova Salon is {0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 7, 0}.
The organ voicing of Bossa Nova Salon is {third, fifth, seventh}.
The overtones of Bossa Nova Salon are the Table of Consonant Overtones.
The permitted moves of Bossa Nova Salon are {rotation, relative substitution, tritone substitution, secondary dominants, harmonic pace}.

Colouring rule for Bossa Nova Salon when the interval above the tonic is listed in {0, 5}: rule succeeds with result maj7.
Colouring rule for Bossa Nova Salon when the interval above the tonic is listed in {2, 4, 9}: rule succeeds with result min7.
Colouring rule for Bossa Nova Salon when the interval above the tonic is 7: rule succeeds with result dom7.
Colouring rule for Bossa Nova Salon: rule succeeds with result min7.
Progression rule for Bossa Nova Salon: rule succeeds with result the Table of Ipanema Stroll.

Table of Bossa Changes
region	degree	quality	label	tones
1	0	maj7	"Imaj7"	{0, 4, 7, 11}
2	9	min7	"vi7"	{0, 3, 7, 10}
3	2	min7	"ii7"	{0, 3, 7, 10}
4	7	dom7	"V7"	{0, 4, 7, 10}

Chapter 14 - Baroque Chorale

[Johann Sebastian's circle of fifths: minor tonic, half-diminished pre-dominant iiø7, major dominant V, and contrary-motion counterpoint.]

Baroque Chorale is a patient triadic genre. The code of Baroque Chorale is "baroque_chorale". The title of Baroque Chorale is "BAROQUE CHORALE". The motto of Baroque Chorale is "Circle-of-fifths counterpoint, half-diminished pre-dominants, and a solemn contrary-motion walking bass."
The family of Baroque Chorale is "SACRED & EARLY".

The changes of Baroque Chorale are the Table of Chorale Changes.
The melody method of Baroque Chorale is member snapping. The melody members of Baroque Chorale are {root, third, fifth, octave}. The melody extensions of Baroque Chorale are {}.
The bass method of Baroque Chorale is contrary motion. The bass walk of Baroque Chorale is {0, 2, 3, 5, 7, 5, 3, 2, 0, 7, 11, 0}.
The organ voicing of Baroque Chorale is {root, third, fifth}.
The overtones of Baroque Chorale are the Table of Consonant Overtones.
The permitted moves of Baroque Chorale are {relative substitution, deceptive cadence, authentic cadence, harmonic pace}.

Colouring rule for Baroque Chorale when the interval above the tonic is listed in {0, 5}: rule succeeds with result minor.
Colouring rule for Baroque Chorale when the interval above the tonic is 2: rule succeeds with result half-diminished.
Colouring rule for Baroque Chorale when the interval above the tonic is 7: rule succeeds with result major.
Colouring rule for Baroque Chorale when the interval above the tonic is listed in {3, 8, 10}: rule succeeds with result major.
Colouring rule for Baroque Chorale: rule succeeds with result minor.
Progression rule for Baroque Chorale: rule succeeds with result the Table of Chorale Cadence.

Table of Chorale Changes
region	degree	quality	label	tones
1	0	minor	"i"	{0, 3, 7}
2	5	minor	"iv"	{0, 3, 7}
3	2	half-diminished	"iiø7"	{0, 3, 6, 10}
4	7	major	"V"	{0, 4, 7}

Chapter 15 - Gothic Horror Organ

[Phantom crypt hymns: minor tonic, chromatic mediants with augmented and diminished harmonies, over a sustained organ pedal bass.]

Gothic Horror Organ is an insistent triadic genre. The code of Gothic Horror Organ is "gothic_horror". The title of Gothic Horror Organ is "GOTHIC HORROR ORGAN". The motto of Gothic Horror Organ is "Crypt hymns and chromatic mediants: minor, augmented, and diminished chords echoing above an unrelenting pedal bass."
The family of Gothic Horror Organ is "ESOTERIC".

The changes of Gothic Horror Organ are the Table of Gothic Changes.
The melody method of Gothic Horror Organ is member snapping. The melody members of Gothic Horror Organ are {root, third, fifth}. The melody extensions of Gothic Horror Organ are {}.
The bass method of Gothic Horror Organ is walking. The bass walk of Gothic Horror Organ is {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}.
The organ voicing of Gothic Horror Organ is {root, third, fifth}.
The overtones of Gothic Horror Organ are the Table of Pythagorean Overtones.
The permitted moves of Gothic Horror Organ are {relative substitution, deceptive cadence, harmonic pace}.

Colouring rule for Gothic Horror Organ when the interval above the tonic is 0: rule succeeds with result minor.
Colouring rule for Gothic Horror Organ when the interval above the tonic is listed in {4, 8}: rule succeeds with result augmented.
Colouring rule for Gothic Horror Organ when the interval above the tonic is listed in {6, 11}: rule succeeds with result dim.
Colouring rule for Gothic Horror Organ when the interval above the tonic is 7: rule succeeds with result major.
Colouring rule for Gothic Horror Organ: rule succeeds with result minor.
Progression rule for Gothic Horror Organ: rule succeeds with result the Table of Crypt Mediants.

Table of Gothic Changes
region	degree	quality	label	tones
1	0	minor	"i"	{0, 3, 7}
2	8	augmented	"♭VI+"	{0, 4, 8}
3	11	dim	"vii°"	{0, 3, 6, 9}
4	7	major	"V"	{0, 4, 7}

Chapter 16 - Gospel Shout

[A camp-meeting parlor revival: major sixths, suspended-fourth "amens", and an energetic walking stride bass.]

Gospel Shout is an insistent triadic genre. The code of Gospel Shout is "gospel_shout". The title of Gospel Shout is "GOSPEL SHOUT & REVIVAL". The motto of Gospel Shout is "Camp-meeting revival: major sixths, suspended-fourth amens, plagal cadences, and an energetic walking stride bass."
The family of Gospel Shout is "SACRED & EARLY".

The changes of Gospel Shout are the Table of Gospel Changes.
The melody method of Gospel Shout is member snapping. The melody members of Gospel Shout are {root, third, fifth}. The melody extensions of Gospel Shout are {}.
The bass method of Gospel Shout is walking. The bass walk of Gospel Shout is {0, 4, 7, 4, 0, 4, 7, 4, 0, 4, 7, 4}.
The organ voicing of Gospel Shout is {third, fifth, octave}.
The overtones of Gospel Shout are the Table of Consonant Overtones.
The permitted moves of Gospel Shout are {plagal cadence, relative substitution, authentic cadence, harmonic pace}.

Colouring rule for Gospel Shout when the interval above the tonic is 0: rule succeeds with result major 6.
Colouring rule for Gospel Shout when the interval above the tonic is 5: rule succeeds with result major.
Colouring rule for Gospel Shout when the interval above the tonic is 7: rule succeeds with result sus4.
Colouring rule for Gospel Shout when the interval above the tonic is listed in {2, 9}: rule succeeds with result minor.
Colouring rule for Gospel Shout: rule succeeds with result major.
Progression rule for Gospel Shout: rule succeeds with result the Table of Revival Amen.

Table of Gospel Changes
region	degree	quality	label	tones
1	0	major 6	"I6"	{0, 4, 7, 9}
2	5	major	"IV"	{0, 4, 7}
3	7	sus4	"Vsus4"	{0, 5, 7}
4	7	dom7	"V7"	{0, 4, 7, 10}

Chapter 17 - Tango Habanera

[Dramatic Buenos Aires salon tango: minor lament, half-diminished ii, and sharp Phrygian dominants over a habanera bass.]

Tango Habanera is an insistent triadic genre. The code of Tango Habanera is "tango_habanera". The title of Tango Habanera is "TANGO HABANERA". The motto of Tango Habanera is "Buenos Aires salon tango: minor lament, half-diminished ii, and sharp Phrygian dominants over a habanera bass."
The family of Tango Habanera is "FOLK & DANCE".

The changes of Tango Habanera are the Table of Tango Changes.
The melody method of Tango Habanera is member snapping. The melody members of Tango Habanera are {root, third, fifth}. The melody extensions of Tango Habanera are {}.
The bass method of Tango Habanera is walking. The bass walk of Tango Habanera is {0, 0, 7, 0, 0, 7, 0, 0, 4, 0, 0, 7}.
The organ voicing of Tango Habanera is {root, third, fifth}.
The overtones of Tango Habanera are the Table of Consonant Overtones.
The permitted moves of Tango Habanera are {relative substitution, phrygian cadence, harmonic pace}.

Colouring rule for Tango Habanera when the interval above the tonic is listed in {0, 5}: rule succeeds with result minor.
Colouring rule for Tango Habanera when the interval above the tonic is 2: rule succeeds with result half-diminished.
Colouring rule for Tango Habanera when the interval above the tonic is 7: rule succeeds with result dom7alt.
Colouring rule for Tango Habanera when the interval above the tonic is 1: rule succeeds with result major.
Colouring rule for Tango Habanera: rule succeeds with result minor.
Progression rule for Tango Habanera: rule succeeds with result the Table of Salon Tango.

Table of Tango Changes
region	degree	quality	label	tones
1	0	minor	"i"	{0, 3, 7}
2	5	minor	"iv"	{0, 3, 7}
3	2	half-diminished	"iiø7"	{0, 3, 6, 10}
4	7	dom7alt	"V7alt"	{0, 4, 7, 10, 1}

Chapter 18 - Neo-Soul Lo-Fi

[Late-night cassette velvet: lush min9, maj7, and min7 chords drifting with rootless guide tones and soft overtones.]

Neo-Soul Lo-Fi is a patient voiced genre. The code of Neo-Soul Lo-Fi is "neo_soul". The title of Neo-Soul Lo-Fi is "NEO-SOUL LO-FI". The motto of Neo-Soul Lo-Fi is "Late-night cassette velvet: lush min9, maj7, and min7 chords drifting with rootless guide tones and soft overtones."
The family of Neo-Soul Lo-Fi is "NIGHT CLUB".

The changes of Neo-Soul Lo-Fi are the Table of Neo-Soul Changes.
The melody method of Neo-Soul Lo-Fi is member snapping. The melody members of Neo-Soul Lo-Fi are {root, third, fifth, seventh, ninth}. The melody extensions of Neo-Soul Lo-Fi are {}.
The bass method of Neo-Soul Lo-Fi is walking. The bass walk of Neo-Soul Lo-Fi is {0, 7, 10, 0, 7, 10, 0, 7, 11, 0, 7, 10}.
The organ voicing of Neo-Soul Lo-Fi is {third, fifth, seventh}.
The overtones of Neo-Soul Lo-Fi are the Table of Consonant Overtones.
The permitted moves of Neo-Soul Lo-Fi are {rotation, relative substitution, tritone substitution, secondary dominants, harmonic pace}.

Colouring rule for Neo-Soul Lo-Fi when the interval above the tonic is listed in {0, 5}: rule succeeds with result maj7.
Colouring rule for Neo-Soul Lo-Fi when the interval above the tonic is listed in {2, 9}: rule succeeds with result min9.
Colouring rule for Neo-Soul Lo-Fi when the interval above the tonic is 4: rule succeeds with result min7.
Colouring rule for Neo-Soul Lo-Fi when the interval above the tonic is 7: rule succeeds with result dom7alt.
Colouring rule for Neo-Soul Lo-Fi: rule succeeds with result min7.
Progression rule for Neo-Soul Lo-Fi: rule succeeds with result the Table of Cassette Velvet.

Table of Neo-Soul Changes
region	degree	quality	label	tones
1	2	min9	"ii9"	{0, 3, 7, 10, 2}
2	7	dom7alt	"V7alt"	{0, 4, 7, 10, 1}
3	0	maj7	"Imaj7"	{0, 4, 7, 11}
4	9	min7	"vi7"	{0, 3, 7, 10}

Chapter 19 - Raw Esoteric Chaos

[Unfettered: the conductor leaves every VM's raw output alone, so only what the Fun Machine needs is written down.]

Raw Esoteric Chaos is an unfettered genre. The code of Raw Esoteric Chaos is "raw_chaos". The title of Raw Esoteric Chaos is "RAW ESOTERIC CHAOS (UNFETTERED VMS)". The motto of Raw Esoteric Chaos is "Zero harmonic filtration. Raw, native, unquantized mathematical outputs from all six esoteric virtual machines."
The family of Raw Esoteric Chaos is "ESOTERIC".

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
The progression of min7 is the Table of Cassette Velvet.
The progression of maj7 is the Table of Ipanema Stroll.
The progression of half-diminished is the Table of Chorale Cadence.
The progression of augmented is the Table of Crypt Mediants.
The progression of sus4 is the Table of Revival Amen.
The progression of major 6 is the Table of Revival Amen.

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

Table of Ice-Cream Changes
degree	quality	melody	shown
0	major	{0, 4, 7}	"[root] Maj"
9	minor	{9, 12, 16}	"[root]m"
5	major	{5, 9, 12}	"[root] Maj"
7	dom7	{7, 11, 14}	"[root]7"

Table of Fasola Lament
degree	quality	melody	shown
0	modal open	{0, 7, 12}	"[root]5"
10	modal open	{10, 14, 17}	"[root]5"
3	major	{3, 7, 10}	"[root] Maj"
7	minor	{7, 10, 14}	"[root]m"

Table of Andalusian Cadence
degree	quality	melody	shown
0	minor	{0, 3, 7}	"[root]m"
10	major	{10, 14, 17}	"[root] Maj"
8	major	{8, 12, 15}	"[root] Maj"
7	phrygian	{7, 8, 11}	"[root] Phryg"

Table of Freygish Turn
degree	quality	melody	shown
0	phrygian	{0, 1, 4}	"[root] Freygish"
5	minor	{5, 8, 12}	"[root]m"
10	minor	{10, 13, 17}	"[root]m"
1	major	{1, 5, 8}	"[root] Maj"

Table of Capstan Shanty
degree	quality	melody	shown
0	major	{0, 4, 7}	"[root] Maj"
5	major	{5, 9, 12}	"[root] Maj"
0	major	{4, 7, 12}	"[root] Maj"
7	major	{7, 11, 14}	"[root] Maj"

Table of Picture Palace
degree	quality	melody	shown
0	maj9	{0, 4, 11}	"[root]maj9"
2	major	{2, 6, 9}	"[root] Maj"
11	minor	{11, 14, 18}	"[root]m"
0	lydian	{0, 6, 7}	"[root] Lyd"

Table of Ipanema Stroll
degree	quality	melody	shown
0	maj7	{0, 4, 11}	"[root]maj7"
9	min7	{9, 12, 16}	"[root]m7"
2	min7	{2, 5, 9}	"[root]m7"
7	dom7	{7, 10, 14}	"[root]7"

Table of Chorale Cadence
degree	quality	melody	shown
0	minor	{0, 3, 7}	"[root]m"
5	minor	{5, 8, 12}	"[root]m"
2	half-diminished	{2, 5, 8}	"[root]ø7"
7	major	{7, 11, 14}	"[root] Maj"

Table of Crypt Mediants
degree	quality	melody	shown
0	minor	{0, 3, 7}	"[root]m"
8	augmented	{8, 12, 16}	"[root]+"
11	dim	{11, 14, 17}	"[root]°"
7	major	{7, 11, 14}	"[root] Maj"

Table of Revival Amen
degree	quality	melody	shown
0	major 6	{0, 4, 9}	"[root]6"
5	major	{5, 9, 12}	"[root] Maj"
7	sus4	{7, 12, 14}	"[root]sus4"
7	dom7	{7, 10, 14}	"[root]7"

Table of Salon Tango
degree	quality	melody	shown
0	minor	{0, 3, 7}	"[root]m"
5	minor	{5, 8, 12}	"[root]m"
2	half-diminished	{2, 5, 8}	"[root]ø7"
7	dom7alt	{7, 11, 15}	"[root]7alt"

Table of Cassette Velvet
degree	quality	melody	shown
2	min9	{2, 5, 11}	"[root]m9"
7	dom7alt	{7, 11, 15}	"[root]7alt"
0	maj7	{0, 4, 11}	"[root]maj7"
9	min7	{9, 12, 16}	"[root]m7"

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

Part 5 - The creature's own

[THE CREATURE'S OWN rulebook (D-043): a creature writes its own changes from its own scale. Every region has a harmonic function; the creature's harmony fields choose a path of functions and, for each, a root from the function's candidates that its scale holds. The chord on that root is the first shape below whose tones all sit in the scale, so even a pentatonic or whole-tone creature finds chords that agree with its melody. Its bass, organ, melody, and overtones come from a genre whose character it borrows.]

[Functions: 1 is tonic (home and its stand-ins), 2 predominant (leaving home), 3 dominant (leaning back). Roots are semitones above the tonic, in order of preference.]

Table of Harmonic Functions
function	name	roots
1	"tonic"	{0, 9, 4, 3, 8}
2	"predominant"	{5, 2, 10, 3, 8}
3	"dominant"	{7, 11, 1, 10, 6}

[Paths: the function of each of the four regions. Every path starts at home and ends leaning home, so the cycle closes.]

Table of Harmonic Paths
path	functions
1	{1, 2, 3, 3}
2	{1, 1, 2, 3}
3	{1, 2, 1, 3}
4	{1, 3, 2, 3}
5	{1, 2, 2, 3}
6	{1, 1, 3, 3}
7	{1, 3, 1, 3}
8	{1, 2, 3, 2}

[Shapes, tried in order on a root: the first whose tones all lie in the creature's scale is its chord.]

Table of Chord Shapes
shape	quality	tones
1	major	{0, 4, 7}
2	minor	{0, 3, 7}
3	dom7	{0, 4, 10}
4	modal open	{0, 2, 7}
5	modal open	{0, 5, 7}
6	modal open	{0, 7}
7	dim	{0, 3, 6}
8	modal open	{0, 5, 10}
