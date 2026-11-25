# Asset register

| Asset | Source / evidence | Scope |
| --- | --- | --- |
| Logo and social card | Existing website preview assets, retained byte-for-byte | Existing private preview |
| Oddmash UI light and dark screenshots | Oddmash/oddmash-ui `docs/assets/playground.png` (blob `2f6e6f1637ca68116b87a05c9a6b137df24cca72`) and `docs/assets/playground-dark.png` (blob `2af7eee80c9170026cbb0c07de0cc23af54f40aa`), merged revision `2b3c3932c9ead0389160ba30cbc98d343ac2df7e` | Own product, preview |
| Interaction Inspector screenshot | Oddmash/interaction-inspector `docs/assets/inspector-demo.png` (blob `b027ad82e82be93e5c7270509bf697cb82c2ea24`), merged revision `54d5c2f8eb1aada550120f5c11b8c0441cbc6cc0` | Own product, synthetic demo, preview |
| Juliya locale-specific playground screenshots | `public/assets/juliya-live-en.png` (1160×626), SHA256 `62efb93fa82b87c162599b9380bc055340e49accfcd7b44cb2b7244d9f6930a9`; `juliya-live-ko.png` (1160×625), SHA256 `f527b6f0f3f8d505570a290a15c26d8aa31f52156e41d65501a461a517792ebc`; `juliya-live-ja.png` (1160×626), SHA256 `ad804f531d6a36c1d5493b9d0861f175364f71628fc4c4f6d12c93f3713411ad`; `juliya-live-zh-cn.png` (1160×626), SHA256 `322903d1e9707b5c73f85cfcceb1d65fadf3811c087e748cb7440dbcfae05ac1` | Captured from the actual publicly deployed Juliya v0.4.1 Pages landing routes (Oddmash/juliya revision `b03c8c02830327d3aa60d1b6e363af50d065ec9b`). Website CI verified all four playground labels, preview language, input text and measured line counts before capture. Images show the complete, unmodified localized playground. |
| Boundra diagram | Original illustration in `public/assets/boundra.svg`, based on the public [architecture and boundary rules](https://github.com/Oddmash/boundra#boundary-rules) | Illustrative diagram, not a captured CLI run |
| Oddmash UI tokens | Oddmash/oddmash-ui src/generated/tokens.css, blob c72ff85231a3f688122bdcbf3cdddab3071bf323 | MIT; matching notice in docs/licenses/oddmash-ui.txt |
| Font stack | System fonts, no downloaded font resources | No redistribution |

All media are self-hosted. Product names and screenshots identify actual public projects; no endorsement or affiliation is claimed. Confirm screenshot distribution scope and trademark rights before public launch. Review dependency licenses on the exact locked build.
