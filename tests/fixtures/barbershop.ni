[An extra, test-only Kapellmeister genre written purely in Inform 7, for P5-23 phase 5 (D-033). It is never shipped: tests/seventh-genre.test.mjs appends it to src/rulebooks.ni and plays it through the conductor, the Fun Machine, and the session ledger to prove a new genre needs no JavaScript.]

Part 5 - A fixture genre

Chapter 1 - Barbershop Quartet

Barbershop Quartet is an insistent voiced genre. The code of Barbershop Quartet is "barbershop_quartet". The title of Barbershop Quartet is "BARBERSHOP PARLOR QUARTET". The motto of Barbershop Quartet is "Close-harmony dominant sevenths around the circle of fifths, ringing the seventh harmonic."

The changes of Barbershop Quartet are the Table of Barbershop Changes.
The melody method of Barbershop Quartet is member snapping. The melody members of Barbershop Quartet are {root, third, fifth, seventh}.
The bass method of Barbershop Quartet is walking. The bass walk of Barbershop Quartet is {0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7}.
The organ voicing of Barbershop Quartet is {third, fifth, seventh}.
The overtones of Barbershop Quartet are the Table of Barbershop Overtones.

[Only the tonic rings as a plain major chord; everything else is a barbershop seventh.]
Colouring rule for Barbershop Quartet when the interval above the tonic is 0: rule succeeds with result major.
Colouring rule for Barbershop Quartet: rule succeeds with result dom7.
Progression rule for Barbershop Quartet: rule succeeds with result the Table of Barbershop Tag.

Table of Barbershop Changes
region	degree	quality	label	tones
1	0	major	"I (Tag)"	{0, 4, 7}
2	9	dom7	"VI7"	{0, 4, 7, 10}
3	2	dom7	"II7"	{0, 4, 7, 10}
4	7	dom7	"V7 (Ring)"	{0, 4, 7, 10}

Table of Barbershop Tag
degree	quality	melody	shown
0	major	{4, 7, 12}	"[root] Maj"
9	dom7	{13, 9, 7}	"[root]7"
2	dom7	{6, 2, 0}	"[root]7"
7	dom7	{5, 11, 7}	"[root]7"

Table of Barbershop Overtones
ratio
"1/1"
"5/4"
"3/2"
"7/4"
"2/1"
